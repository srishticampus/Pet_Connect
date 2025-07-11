import { ExternalLink, MoreHorizontal } from "lucide-react"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTablePagination } from "@/components/ui/table-pagination"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";

import { getAllAdopters, approveAdopter, rejectAdopter, getApprovedAdopters } from "./adminService" // Import the new API functions
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Define columns for the Adopters table
export const columns = [
  {
    header:"S.No.",
    name:"S.No.",
    cell: ({row})=>(Number(row.id)+1)
  },
  {
    accessorKey: "name",
    header: "Profile",
    name:"Profile"
  },
  {
    accessorKey:"phoneNumber",
    header:"Phone Number",
    name:"Phone Number"
  },
  {
    accessorKey: "email",
    header: "Email ID",
    name:"Email ID"
  },
  {
    accessorKey:"address",
    header:"Place",
    name:"Place"
  },
  {
    accessorKey:"aadhaarImage",
    header:"Aadhaar Image",
    name:"Aadhaar Image",
    cell: ({row})=>(row.getValue("aadhaarImage")?(<Button asChild variant="link"><a href={`${import.meta.env.VITE_API_URL}${row.getValue("aadhaarImage")}`} target="_blank">Preview <ExternalLink className="h-4 w-4" /></a></Button>):(<p>No Aadhaar Image</p>))
  },
  {
    accessorKey:"aadhaarNumber",
    header:"Aadhaar Number",
    name:"Aadhaar Number"
  },
  {
    accessorKey:"isApproved",
    header:"Approved",
    name:"Approved",
    cell: ({row})=>(row.getValue("isApproved") ? "Yes" : "No")
  },
  {
      id: "actions",
      cell: ({ row, table }) => {
        const adopter = row.original
        const [isApproving, setIsApproving] = useState(false);
        const [isRejecting, setIsRejecting] = useState(false);
        const fetchAdopters = table.options.meta?.fetchAdopters;
        const [openRejectDialog, setOpenRejectDialog] = useState(false);


        const handleApprove = async () => {
          setIsApproving(true);
          try {
            await approveAdopter(adopter._id);
            fetchAdopters();
          } catch (error) {
            console.error("Failed to approve adopter:", error);
          } finally {
            setIsApproving(false);
          }
        };

        const handleReject = async () => {
          setIsRejecting(true);
          try {
            await rejectAdopter(adopter._id);
            fetchAdopters();
          } catch (error) {
            console.error("Failed to reject adopter:", error);
          } finally {
            setIsRejecting(false);
            setOpenRejectDialog(false);
          }
        };

        return (
          <>
          <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {!adopter.isApproved && (
                  <DropdownMenuItem onClick={handleApprove} disabled={isApproving}>
                    {isApproving ? "Approving..." : "Approve Adopter"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem variant="danger" onClick={()=>setOpenRejectDialog(true)} disabled={isRejecting}>
                    {isRejecting ? "Rejecting..." : "Reject Adopter"}
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Reject Adopter</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject this adopter? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpenRejectDialog(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting}
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </>
        )
      },
    },
]


export function DataTable({
  columns,
  data,
  fetchAdopters
}) {
  const [columnFilters, setColumnFilters] = useState([])
  const [currentFilter,setCurrentFilter] = useState("email")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state:{
      columnFilters
    },
    meta: {
      fetchAdopters,
    },
  })

  return (
    <div className="rounded-md border w-full">
      <div className="flex items-center p-4 gap-2">
        <Select value={currentFilter} onValueChange={setCurrentFilter} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            {table.getAllLeafColumns().filter(
              column => ["name", "email", "address"].includes(column.id)
            ).map(column => {
              return column.columnDef.name && (
                <SelectItem
                  key={column.id}
                  value={column.id}
                >
                  {column.columnDef.name}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <Input
        placeholder={`Filter ${currentFilter}`}
        value={(table.getColumn(currentFilter)?.getFilterValue()) ?? ""}
        onChange={(event) =>
          table.getColumn(currentFilter)?.setFilterValue(event.target.value)
        }
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="p-2">
        <DataTablePagination table={table} className="" />
      </div>

    </div>
  )
}


export default function AdoptersTable() {
  const [data, setData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [viewApproved, setViewApproved] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  const fetchAdopters = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const adoptersData = await getAllAdopters();
      setData(adoptersData);
    } catch (error) {
      console.error("Failed to fetch adopters:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchApprovedAdopters = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const approvedAdoptersData = await getApprovedAdopters();
      setApprovedData(approvedAdoptersData);
    } catch (error) {
      console.error("Failed to fetch approved adopters:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchAdopters();
    fetchApprovedAdopters();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto w-full animate-pulse">
        <main className="flex-1 px-6 pb-6 w-full">
          <div className="bg-white rounded-lg h-full p-6 w-full">
            <Skeleton className="h-8 w-1/2 mb-4" /> {/* Title skeleton */}
            <Skeleton className="h-10 w-48 mb-4" /> {/* Button skeleton */}
            <div className="flex items-center p-4 gap-2">
              <Skeleton className="h-10 w-[180px]" /> {/* Select skeleton */}
              <Skeleton className="h-10 w-full max-w-sm" /> {/* Input skeleton */}
            </div>
            <div className="rounded-md border w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[...Array(8)].map((_, index) => ( // Assuming 8 columns for headers
                      <TableHead key={index}>
                        <Skeleton className="h-6 w-full" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, rowIndex) => ( // 5 skeleton rows
                    <TableRow key={rowIndex}>
                      {[...Array(8)].map((_, cellIndex) => ( // 8 skeleton cells per row
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-2">
                <Skeleton className="h-8 w-full" /> {/* Pagination skeleton */}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <h2 className="text-2xl font-bold mb-4">{viewApproved ? "Approved Adopters" : "Registered Adopter Requests"}</h2>
          <Button onClick={() => setViewApproved(!viewApproved)} className="mb-4">
            {viewApproved ? "View Registered Requests" : "View Approved Adopters"}
          </Button>
          <DataTable columns={columns} data={viewApproved ? approvedData : data} fetchAdopters={viewApproved ? fetchApprovedAdopters : fetchAdopters} />
        </div>
      </main>
    </div>
  )
}

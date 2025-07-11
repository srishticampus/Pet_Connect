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
import { Skeleton } from "@/components/ui/skeleton"

import { getAllRescueShelters, approveRescueShelter, rejectRescueShelter, getApprovedRescueShelters } from "./adminService" // Import the new API functions
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Define columns for the Rescue Shelters table
export const columns = [
  {
    header:"S.No.",
    name:"S.No.",
    cell: ({row})=>(Number(row.id)+1)
  },
  {
    accessorKey: "name",
    header: "Name",
    name:"Name"
  },
  {
    accessorKey: "email",
    header: "Email",
    name:"Email"
  },
  {
    accessorKey:"phoneNumber",
    header:"Phone Number",
    name:"Phone Number"
  },
  {
    accessorKey:"address",
    header:"Place",
    name:"Place"
  },
  {
    accessorKey:"certificate",
    header:"Certificate",
    name:"Certificate",
    cell: ({row})=>(row.getValue("certificate")?(<Button asChild variant="link"><a href={`${import.meta.env.VITE_API_URL}${row.getValue("certificate")}`} target="_blank">Preview <ExternalLink className="h-4 w-4" /></a></Button>):(<p>No Certificate</p>))
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
        const rescueShelter = row.original
        const [isApproving, setIsApproving] = useState(false);
        const [isRejecting, setIsRejecting] = useState(false);
        const fetchRescueShelters = table.options.meta?.fetchRescueShelters;
        const [openRejectDialog, setOpenRejectDialog] = useState(false);


        const handleApprove = async () => {
          setIsApproving(true);
          try {
            await approveRescueShelter(rescueShelter._id);
            fetchRescueShelters();
          } catch (error) {
            console.error("Failed to approve rescue shelter:", error);
          } finally {
            setIsApproving(false);
          }
        };

        const handleReject = async () => {
          setIsRejecting(true);
          try {
            await rejectRescueShelter(rescueShelter._id);
            fetchRescueShelters();
          } catch (error) {
            console.error("Failed to reject rescue shelter:", error);
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
                {!rescueShelter.isApproved && (
                  <DropdownMenuItem onClick={handleApprove} disabled={isApproving}>
                    {isApproving ? "Approving..." : "Approve Rescue Shelter"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem variant="danger" onClick={()=>setOpenRejectDialog(true)} disabled={isRejecting}>
                    {isRejecting ? "Rejecting..." : "Reject Rescue Shelter"}
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Reject Rescue Shelter</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject this rescue shelter? This action cannot be undone.
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
  fetchRescueShelters
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
      fetchRescueShelters,
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


export default function RescueSheltersTable() {
  const [data, setData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [viewApproved, setViewApproved] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchRescueShelters = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const rescueSheltersData = await getAllRescueShelters();
      setData(rescueSheltersData);
    } catch (error) {
      console.error("Failed to fetch rescue shelters:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching (or on error)
    }
  };

  const fetchApprovedRescueShelters = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const approvedRescueSheltersData = await getApprovedRescueShelters();
      setApprovedData(approvedRescueSheltersData);
    } catch (error) {
      console.error("Failed to fetch approved rescue shelters:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching (or on error)
    }
  };

  useEffect(() => {
    fetchRescueShelters();
    fetchApprovedRescueShelters();
  }, []);

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <h2 className="text-2xl font-bold mb-4">{viewApproved ? "Approved Rescue Shelters" : "Rescue Shelter Requests"}</h2>
          <Button onClick={() => setViewApproved(!viewApproved)} className="mb-4">
            {viewApproved ? "View Registered Requests" : "View Approved Rescue Shelters"}
          </Button>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={viewApproved ? approvedData : data} fetchRescueShelters={viewApproved ? fetchApprovedRescueShelters : fetchRescueShelters} />
          )}
        </div>
      </main>
    </div>
  )
}

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

import { getAllPetOwners, addPetOwner, updatePetOwner,deletePetOwner } from "./petOwnerService" // Import the new API function
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export const columns = [
  {
    accessorKey:"id", // Accessor key is used to identify the data in the table
    header:"S.No.",
    name:"S.No.",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profile" />
    ),
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
      id: "actions",
      cell: ({ row, table }) => {
        const petOwner = row.original
        const [isDeleting, setIsDeleting] = useState(false);
        const fetchPetOwners = table.options.meta?.fetchPetOwners;
        const [open, setOpen] = useState(false);

        const handleDelete = async () => {
          setIsDeleting(true);
          try {
            
            await deletePetOwner(petOwner._id);
            // Refresh the pet owners data after successful deletion
            fetchPetOwners();
          } catch (error) {
            console.error("Failed to delete pet owner:", error);
            // Handle error appropriately, maybe show an error message to the user
          } finally {
            setIsDeleting(false);
            setOpen(false);
          }
        };

        return (
          <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {/* <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(petOwner.id)}
                  >
                  Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem variant="danger" onClick={()=>setOpen(true)} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete Pet Owner"}
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Pet Owner</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this pet owner? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
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
  fetchPetOwners,
  loading // Add loading prop
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
      fetchPetOwners,
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
          {loading ? (
            // Skeleton rows
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
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

export default function PetOwnersTable() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true); // Add loading state

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values) {
    addPetOwner(values).then(()=>{
      fetchPetOwners()
      setOpen(false)
    }).catch((e)=>{
      console.log(e)
    })
  }

  const fetchPetOwners = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const petOwnersData = await getAllPetOwners();
      setData(petOwnersData);
    } catch (error) {
      console.error("Failed to fetch pet owners:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching (or error)
    }
  };

  useEffect(() => {
    fetchPetOwners();
  }, []);

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <DataTable columns={columns} data={data} fetchPetOwners={fetchPetOwners} loading={loading} />
        </div>
      </main>
    </div>
  )
}

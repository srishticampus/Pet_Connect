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

import { getAllPetOwners } from "@/utils/api" // Import the new API function

export const columns = [
  {
    accessorKey:"id",
    header:"S.No.",
    name:"S.No.",
  },
  {
    accessorKey: "profile",
    header: "Profile",
    name:"Profile"
  },
  {
    accessorKey:"phone",
    header:"Phone Number",
    name:"Phone Number"
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email ID" />
    ),
    name:"Email ID"
  },
  {
    accessorKey:"place",
    header:"Place",
    name:"Place"
  },
  {
    accessorKey:"aadhaar",
    header:"Aadhaar Image",
    name:"Aadhaar Image",
    cell: ({row})=>(<Button asChild variant="link"><a href={row.getValue("aadhaar")} target="_blank">Preview <ExternalLink className="h-4 w-4" /></a></Button>)
  },
  {
    accessorKey:"aadhaarNumber",
    header:"Aadhaar Number",
    name:"Aadhaar Number"
  },
  {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
]


export function DataTable({
  columns,
  data,
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
    }
  })

  return (
    <div className="rounded-md border w-full">
      <div className="flex items-center p-4 gap-2">
        <Select value={currentFilter} onValueChange={setCurrentFilter} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            {table.getAllLeafColumns().map(column => {
              return  column.columnDef.name&&(
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

export default function PetOwnersTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPetOwners = async () => {
      try {
        const petOwnersData = await getAllPetOwners();
        setData(petOwnersData);
      } catch (error) {
        console.error("Failed to fetch pet owners:", error);
      }
    };

    fetchPetOwners();
  }, []);

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <DataTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  )
}

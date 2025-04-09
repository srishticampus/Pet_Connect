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
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
const data =[
    {
      id: "1",
      profile: "John Doe",
      phone: "123-456-7890",
      email: "john.doe@example.com",
      place: "New York",
      aadhaar: "https://example.com/aadhaar1.jpg",
      aadhaarNumber: "1234 5678 9012",
    },
    {
      id: "2",
      profile: "Jane Smith",
      phone: "987-654-3210",
      email: "jane.smith@example.com",
      place: "Los Angeles",
      aadhaar: "https://example.com/aadhaar2.jpg",
      aadhaarNumber: "9876 5432 1098",
    },
    {
      id: "3",
      profile: "Robert Jones",
      phone: "555-123-4567",
      email: "robert.jones@example.com",
      place: "Chicago",
      aadhaar: "https://example.com/aadhaar3.jpg",
      aadhaarNumber: "4321 0987 6543",
    },
    {
      id: "4",
      profile: "Alice Brown",
      phone: "111-222-3333",
      email: "alice.brown@example.com",
      place: "Houston",
      aadhaar: "https://example.com/aadhaar4.jpg",
      aadhaarNumber: "8765 4321 0987",
    },
    {
      id: "5",
      profile: "Michael Davis",
      phone: "444-555-6666",
      email: "michael.davis@example.com",
      place: "Phoenix",
      aadhaar: "https://example.com/aadhaar5.jpg",
      aadhaarNumber: "2345 6789 0123",
    },
    {
      id: "6",
      profile: "Jessica Wilson",
      phone: "777-888-9999",
      email: "jessica.wilson@example.com",
      place: "Philadelphia",
      aadhaar: "https://example.com/aadhaar6.jpg",
      aadhaarNumber: "6789 0123 4567",
    },
    {
      id: "7",
      profile: "Christopher Garcia",
      phone: "222-333-4444",
      email: "christopher.garcia@example.com",
      place: "San Antonio",
      aadhaar: "https://example.com/aadhaar7.jpg",
      aadhaarNumber: "0123 4567 8901",
    },
    {
      id: "8",
      profile: "Ashley Rodriguez",
      phone: "666-777-8888",
      email: "ashley.rodriguez@example.com",
      place: "San Diego",
      aadhaar: "https://example.com/aadhaar8.jpg",
      aadhaarNumber: "5432 1098 7654",
    },
    {
      id: "9",
      profile: "Matthew Williams",
      phone: "333-444-5555",
      email: "matthew.williams@example.com",
      place: "Dallas",
      aadhaar: "https://example.com/aadhaar9.jpg",
      aadhaarNumber: "9012 3456 7890",
    },
    {
      id: "10",
      profile: "Amanda Martinez",
      phone: "888-999-0000",
      email: "amanda.martinez@example.com",
      place: "San Jose",
      aadhaar: "https://example.com/aadhaar10.jpg",
      aadhaarNumber: "3456 7890 1234",
    },
    {
      id: "11",
      profile: "David Anderson",
      phone: "999-000-1111",
      email: "david.anderson@example.com",
      place: "Austin",
      aadhaar: "https://example.com/aadhaar11.jpg",
      aadhaarNumber: "7890 1234 5678",
    },
    {
      id: "12",
      profile: "Sarah Taylor",
      phone: "000-111-2222",
      email: "sarah.taylor@example.com",
      place: "Jacksonville",
      aadhaar: "https://example.com/aadhaar12.jpg",
      aadhaarNumber: "1234 5678 9012",
    },
  ]
export default function PetOwnersTable() {

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

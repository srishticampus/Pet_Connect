import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import api from '@/utils/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTablePagination } from "@/components/ui/table-pagination"
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    name: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    name: "Email",
  },
  {
    accessorKey: "comments",
    header: "Comments",
    name: "Comments",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    name: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const submission = row.original;
      const fetchSubmissions = table.options.meta?.fetchSubmissions;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await api.delete(`/contact/${submission._id}`);
          fetchSubmissions(); // Refresh submissions after deletion
        } catch (error) {
          console.error("Failed to delete submission:", error);
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      );
    },
  },
];

function DataTable({ columns, data, fetchSubmissions }) {
  const [columnFilters, setColumnFilters] = useState([])
  const [currentFilter, setCurrentFilter] = useState("email")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    },
    meta: {
      fetchSubmissions,
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
              column => ["name", "email"].includes(column.id)
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


const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await api.get('/contact');
      setSubmissions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="container mx-auto w-full">
        <main className="flex-1 px-6 pb-6 w-full">
          <div className="bg-white rounded-lg h-full p-6 w-full">
            <h1 className="text-2xl font-semibold mb-4">Contact Form Submissions</h1>
            {loading ? (
              <div className="rounded-md border w-full">
                <div className="flex items-center p-4 gap-2">
                  <Skeleton className="h-10 w-[180px]" /> {/* Select skeleton */}
                  <Skeleton className="h-10 w-full max-w-sm" /> {/* Input skeleton */}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[...Array(5)].map((_, index) => ( // Assuming 5 columns for headers
                        <TableHead key={index}>
                          <Skeleton className="h-6 w-full" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, rowIndex) => ( // 5 skeleton rows
                      <TableRow key={rowIndex}>
                        {[...Array(5)].map((_, cellIndex) => ( // 5 skeleton cells per row
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
            ) : (
              <DataTable columns={columns} data={submissions} fetchSubmissions={fetchSubmissions} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactSubmissions;

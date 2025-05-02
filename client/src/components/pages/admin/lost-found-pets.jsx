import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/ui/table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLostFoundPets, updatePetStatus } from './adminService';
import { MoreHorizontal } from 'lucide-react';

export const columns = [
  {
    accessorKey: "id",
    header: "S.No.",
    name: "S.No."
  },
  {
    accessorKey: "Photo",
    header: "Photo",
    cell: ({ row }) => {
      const pet = row.original;
      return pet.Photo ? (
        <img src={pet.Photo} alt={pet.name} className="w-16 h-16 object-cover rounded-md" />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          No Image
        </div>
      );
    },
    name: "Photo"
  },
  {
    accessorKey: "Breed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Breed" />
    ),
    name: "Breed"
  },
  {
    accessorKey: "Species",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Species" />
    ),
    name: "Species"
  },
  {
    accessorKey: "Size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    name: "Size"
  },
  {
    accessorKey: "Age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    name: "Age"
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    name: "Status"
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const pet = row.original;
      const fetchPets = table.options.meta?.fetchPets;
      const [open, setOpen] = useState(false);
      const [newStatus, setNewStatus] = useState(pet.status);

      const handleStatusChange = async () => {
        if (newStatus) {
          try {
            await updatePetStatus(pet._id, newStatus);
            fetchPets(); // Refresh the list
            setOpen(false); // Close the dialog
          } catch (error) {
            console.error('Error updating pet status:', error);
          }
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
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  View Details / Update Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Pet Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center">
                  <Label>Photo</Label>
                  {pet.Photo ? (
                    <img src={pet.Photo} alt={pet.name} className="w-32 h-32 object-cover rounded-md mt-2" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 mt-2">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <Label>Breed</Label>
                  <p>{pet.Breed || 'N/A'}</p>
                </div>
                <div>
                  <Label>Species</Label>
                  <p>{pet.Species}</p>
                </div>
                <div>
                  <Label>Size</Label>
                  <p>{pet.Size || 'N/A'}</p>
                </div>
                <div>
                  <Label>Age</Label>
                  <p>{pet.Age || 'N/A'}</p>
                </div>
                <div>
                  <Label htmlFor="status">Update Status</Label>
                  <Select onValueChange={setNewStatus} value={newStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChange}>Update Status</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

function DataTable({
  columns,
  data,
  fetchPets
}) {
  const [columnFilters, setColumnFilters] = useState([])
  const [currentFilter, setCurrentFilter] = useState("Breed")

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
      fetchPets,
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
            {table.getAllLeafColumns().map(column => {
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


export default function LostFoundPets() {
  const [data, setData] = useState([]);

  const fetchPets = async () => {
    try {
      let petsData = await getLostFoundPets();
      petsData = petsData.map((pet, idx) => {
        pet.id = idx + 1;
        return pet;
      });
      setData(petsData)
    } catch (error) {
      console.error("Failed to fetch lost/found pets:", error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <DataTable columns={columns} data={data} fetchPets={fetchPets} />
        </div>
      </main>
    </div>
  )
}
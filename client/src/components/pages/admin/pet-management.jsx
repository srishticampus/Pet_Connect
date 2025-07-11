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
import { addPet, deletePet, getAllPets, updatePet } from './petService';
import { MoreHorizontal } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  species: z.string().min(2, {
    message: "Species must be at least 2 characters.",
  }),
  shortDescription: z.string().min(2, {
    message: "Short description must be at least 2 characters.",
  }),
  age: z.string().min(1, {
    message: "Age must be at least 1 characters.",
  }),
  gender: z.string().min(4, {
    message: "Gender must be at least 4 characters.",
  }),
  breed:  z.string().min(2, {
    message: "Breed must be at least 2 characters.",
  }),
  size:  z.string().min(2, {
    message: "Size must be at least 2 characters.",
  }),
  description:  z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  healthVaccinations:  z.string().min(2, {
    message: "HealthVaccinations must be at least 2 characters.",
  }),
  origin:  z.string().min(2, {
    message: "Origin must be at least 2 characters.",
  }),
})

export const columns = [
  {
    accessorKey: "id",
    header: "S.No.",
    name: "S.No."
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    name: "Name"
  },
  {
    accessorKey: "Species",
    header: "Species",
    name: "Species"
  },
  {
    accessorKey: "Breed",
    header: "Breed",
    name: "Breed"
  },
  {
    accessorKey: "Age",
    header: "Age",
    name: "Age"
  },
  {
    accessorKey: "Gender",
    header: "Gender",
    name: "Gender"
  },
  {
    accessorKey: "Size",
    header: "Size",
    name: "Size"
  },
  {
    accessorKey: "origin",
    header: "Origin",
    name: "Origin"
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const pet = row.original;
      return pet.petOwner ? pet.petOwner.name : "No owner";
    },
    name: "Owner"
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const pet = row.original
      const [isDeleting, setIsDeleting] = useState(false);
      const fetchPets = table.options.meta?.fetchPets;
      const [open, setOpen] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await deletePet(pet._id);
          fetchPets();
        } catch (error) {
          console.error("Failed to delete pet:", error);
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
                <DropdownMenuItem variant="danger" onClick={() => setOpen(true)} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Pet"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Pet</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this pet? This action cannot be undone.
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

function DataTable({
  columns,
  data,
  fetchPets
}) {
  const [columnFilters, setColumnFilters] = useState([])
  const [currentFilter, setCurrentFilter] = useState("name")

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
            {table.getAllLeafColumns().filter(
              column => ["name"].includes(column.id)
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

export default function PetManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      species: "",
      shortDescription: "",
      age: "",
      gender: "",
      breed: "",
      size: "",
      description: "",
      healthVaccinations: "",
      origin: "",
    },
  })

  function onSubmit(values) {
    addPet(values).then(() => {
      fetchPets()
      setOpen(false)
    }).catch((e) => {
      console.log(e)
    })
  }

  const fetchPets = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      let petsData = await getAllPets();
      petsData = petsData.map((pet, idx) => {
        pet.id = idx + 1;
        return pet;
      });
      setData(petsData);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching (success or error)
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {/* <Button variant="primary">Add Pet</Button> */}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Pet</DialogTitle>
                <DialogDescription>
                  Add a new pet to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" {...form.register("name")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="species" className="text-right">
                    Species
                  </Label>
                  <Input id="species" className="col-span-3" {...form.register("species")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortDescription" className="text-right">
                    Short Description
                  </Label>
                  <Input id="shortDescription" className="col-span-3" {...form.register("shortDescription")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <Input id="age" className="col-span-3" {...form.register("age")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">
                    Gender
                  </Label>
                  <Input id="gender" className="col-span-3" {...form.register("gender")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="breed" className="text-right">
                    Breed
                  </Label>
                  <Input id="breed" className="col-span-3" {...form.register("breed")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="size" className="text-right">
                    Size
                  </Label>
                  <Input id="size" className="col-span-3" {...form.register("size")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input id="description" className="col-span-3" {...form.register("description")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="healthVaccinations" className="text-right">
                    Health Vaccinations
                  </Label>
                  <Input id="healthVaccinations" className="col-span-3" {...form.register("healthVaccinations")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="origin" className="text-right">
                    Origin
                  </Label>
                  <Input id="origin" className="col-span-3" {...form.register("origin")} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {loading ? (
            <div className="animate-pulse">
              <Skeleton className="h-8 w-1/2 mb-4" /> {/* Title skeleton */}
              <div className="flex items-center p-4 gap-2">
                <Skeleton className="h-10 w-[180px]" /> {/* Select skeleton */}
                <Skeleton className="h-10 w-full max-w-sm" /> {/* Input skeleton */}
              </div>
              <div className="rounded-md border w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[...Array(9)].map((_, index) => ( // Assuming 9 columns for headers
                        <TableHead key={index}>
                          <Skeleton className="h-6 w-full" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, rowIndex) => ( // 5 skeleton rows
                      <TableRow key={rowIndex}>
                        {[...Array(9)].map((_, cellIndex) => ( // 9 skeleton cells per row
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
          ) : (
            <DataTable columns={columns} data={data} fetchPets={fetchPets} />
          )}
        </div>
      </main>
    </div>
  )
}

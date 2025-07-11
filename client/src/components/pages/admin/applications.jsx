import React, { useEffect, useState } from 'react';
import { getApplications, approveApplication, rejectApplication } from './adminService'; // Import application service functions
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
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


// Define columns for the Applications table
export const columns = [
  {
    accessorKey: "_id",
    header: "ID",
    name: "ID",
  },
  {
    accessorKey: "applicant.name",
    id: "applicantName", // Added simple string ID for filtering
    header: "Applicant",
    name: "Applicant",
    cell: ({ row }) => row.original.applicant?.name || 'N/A',
  },
  {
    accessorKey: "pet.name",
    id: "petName", // Added simple string ID for filtering
    header: "Pet",
    name: "Pet",
    cell: ({ row }) => row.original.pet?.name || 'N/A',
  },
  {
    accessorKey: "message",
    header: "Message",
    name: "Message",
  },
  {
    accessorKey: "status",
    header: "Status",
    name: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === 'approved' ? 'success' : row.getValue("status") === 'rejected' ? 'destructive' : 'default'}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const application = row.original;
      const [isApproving, setIsApproving] = useState(false);
      const [isRejecting, setIsRejecting] = useState(false);
      const fetchApplications = table.options.meta?.fetchApplications;
      const [openRejectDialog, setOpenRejectDialog] = useState(false);


      const handleApprove = async () => {
        setIsApproving(true);
        try {
          await approveApplication(application._id);
          fetchApplications();
        } catch (error) {
          console.error("Failed to approve application:", error);
        } finally {
          setIsApproving(false);
        }
      };

      const handleReject = async () => {
        setIsRejecting(true);
        try {
          await rejectApplication(application._id);
          fetchApplications();
        } catch (error) {
          console.error("Failed to reject application:", error);
        } finally {
          setIsRejecting(false);
          setOpenRejectDialog(false);
        }
      };

      return (
        <>
          <Dialog
            open={openRejectDialog}
            onOpenChange={(open) => {
              setOpenRejectDialog(open);
              if (!open) {
                setTimeout(() => {
                  document.body.style.pointerEvents = 'auto'; // Enable pointer events
                }, 300); // Close dialog after 100ms
              }
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {application.status === 'pending' && (
                  <>
                    <DropdownMenuItem onClick={handleApprove} disabled={isApproving}>
                      {isApproving ? "Approving..." : "Approve"}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="danger" onClick={() => setOpenRejectDialog(true)} disabled={isRejecting}>
                      {isRejecting ? "Rejecting..." : "Reject"}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Reject Application</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject this application? This action cannot be undone.
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
      );
    },
  },
];


export function DataTable({
  columns,
  data,
  fetchApplications
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("applicantName"); // Default filter, using simple ID

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
      fetchApplications,
    },
  });

  return (
    <div className="rounded-md border w-full">
      <div className="flex items-center p-4 gap-2">
        <Select value={currentFilter} onValueChange={setCurrentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            {table.getAllLeafColumns().filter(
              column => ["applicantName", "petName"].includes(column.id)
            ).map(column => {
              return column.columnDef.name && (
                <SelectItem
                  key={column.id}
                  value={column.id} // Use column.id for the value
                >
                  {column.columnDef.name} {/* Display column.columnDef.name */}
                </SelectItem>
              );
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
                );
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
  );
}


const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const applicationsData = await getApplications();
      setApplications(applicationsData);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto w-full animate-pulse">
        <main className="flex-1 px-6 pb-6 w-full">
          <div className="bg-white rounded-lg h-full p-6 w-full">
            <Skeleton className="h-8 w-1/2 mb-4" /> {/* Title skeleton */}
            <div className="flex items-center p-4 gap-2">
              <Skeleton className="h-10 w-[180px]" /> {/* Select skeleton */}
              <Skeleton className="h-10 w-full max-w-sm" /> {/* Input skeleton */}
            </div>
            <div className="rounded-md border w-full">
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
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading applications: {error.message}</div>;
  }

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <h2 className="text-2xl font-bold mb-4">Adoption Applications</h2>
          <DataTable columns={columns} data={applications} fetchApplications={fetchApplications} />
        </div>
      </main>
    </div>
  );
};

export default AdminApplicationsPage;

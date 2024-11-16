import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./table-components/data-table-column-header";
import { DataTableRowActions } from "./table-components/data-table-actions";
import { format } from "date-fns";

export type Reservation = {
  id: number;
  adults: number;
  chalet: {
    id: number;
    name: string;
    chaletType: string;
    capacity: number;
    price: number;
    description?: string;
    chaletImage?: string;
    amenities?: string[];
    available: boolean;
    maintenanceMode: boolean;
  };
  checkIn: string;
  checkOut: string;
  children: number;
  chaletId: number;
  customerId: number;
  status: string;
  paymentStatus: string;
  totalCost: number;
};

export const columns: ColumnDef<Reservation>[] = [
    {
      accessorKey: "rowNumber",
      header: "#",
      cell: ({ row }) => row.index + 1, // For numbering rows
    },
    {
      accessorKey: "chalet.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chalet Name" />
      ),
      cell: ({ row }) => row.original.chalet.name, // Direct access to chalet name
    },
    {
        accessorKey: "checkIn",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Check In" />
        ),
        cell: ({ row }) => format(new Date(row.original.checkIn), 'MMM dd, yyyy, h:mm a'), // Format check-in date
      },
      {
        accessorKey: "checkOut",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Check Out" />
        ),
        cell: ({ row }) => format(new Date(row.original.checkOut), 'MMM dd, yyyy, h:mm a'), // Format check-out date
      },
    {
      accessorKey: "totalGuests",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Guests" />
      ),
      cell: ({ row }) => row.original.adults + row.original.children, // Calculating total guests
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Booking Status" />
        ),
        cell: ({ row }) => (
          <span
            style={{
              color: row.original.status === "CONFIRMED" ? "green" : "orange",
              fontWeight: "bold",
            }}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Payment Status" />
        ),
        cell: ({ row }) => (
          <span
            style={{
              color: row.original.paymentStatus === "PAID" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {row.original.paymentStatus}
          </span>
        ),
      },
    {
      accessorKey: "totalCost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Cost" />
      ),
      cell: ({ row }) => `KES ${parseFloat(row.original.totalCost.toString()).toFixed(2)}`, // Formatting total cost
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./table-components/data-table-column-header";
import { DataTableRowActions } from "./table-components/data-table-actions";
import { format } from "date-fns";

export type Transaction = {
  id: number;
  amount: string;
  paymentMethod: string;
  transactionId: string;
  date: string;
  status: string;
  notes: string | null;
  reservationId: number;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return 'bg-red-500';
       case 'PAID':
            return 'bg-green-500 hover:bg-green-700';
      default:
        return 'bg-gray-500';
    }
  };
  
  export const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "rowNumber",
      header: "#",
      cell: ({ row }) => row.index + 1, // For numbering rows
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded ${getStatusColor(row.getValue("status"))}`}>
          {row.getValue("status")}
        </span>
      ),
    },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Payment Method" />
        ),
      },
      {
        accessorKey: "transactionId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Transaction Data" />
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy, h:mm a'),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
  ]
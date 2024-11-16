import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./table-components/data-table-column-header";
import { DataTableRowActions } from "./table-components/data-table-actions";

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  nationalIdNumber: string;
  };
  
  export const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "rowNumber",
      header: "#",
      cell: ({ row }) => row.index + 1, // For numbering rows
    },
      {
        accessorKey: "firstName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
      },
      {
        accessorKey: "lastName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Address" />
        ),
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Address" />
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
  ]
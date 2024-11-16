import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./table-components/data-table-column-header";
import { DataTableRowActions } from "./table-components/data-table-actions";

export type Chalet = {
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

const getAvailabilityColor = (available: boolean) =>
  available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
const getMaintenanceColor = (maintenanceMode: boolean) =>
  maintenanceMode
    ? "bg-yellow-100 text-yellow-800"
    : "bg-blue-100 text-blue-800";

export const columns: ColumnDef<Chalet>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => row.index + 1, // For numbering rows
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chalet Name" />
    ),
    cell: ({ row }) => {
      const chalet = row.original;
      return (
        <div className="flex items-center gap-x-3 ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
          <img
            className="inline-block w-[50px] h-[38px] rounded-md object-cover"
            src={chalet.chaletImage}
            alt={`Image photo of ${chalet.name}`}
            aria-hidden="true"
          />
          <div className="grow">
            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
              {chalet.name}
            </span>
            <span
              className="block text-sm text-gray-500 dark:text-neutral-500"
              aria-label="text"
            >
              {chalet.chaletType}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "chaletType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chalet Type" />
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
  },
  {
    accessorKey: "available",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Availability" />
    ),
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded ${getAvailabilityColor(
          row.getValue("available")
        )}`}
      >
        {row.getValue("available") ? "Available" : "Unavailable"}
      </span>
    ),
  },
  {
    accessorKey: "maintenanceMode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Maintenance" />
    ),
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded ${getMaintenanceColor(
          row.getValue("maintenanceMode")
        )}`}
      >
        {row.getValue("maintenanceMode") ? "In Maintenance" : "Operational"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetReservations } from "@/features/reservation/use-get-reservations";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const Reservations = () => {
    const { data: allReservations, isLoading } = useGetReservations();
    

    if (isLoading) {
        return (
          <div className="max-w-screen-2xl w-full pb-10">
            <Card className="border-none drop-shadow-sm">
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full flex items-center justify-center">
                  <Loader2 className="size-6 text-orange-300 animate-spin" />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

  return (
    <div>
          <Helmet>
        <title>Reservations</title>
      </Helmet>

      <div className="max-w-screen-2xl w-full pb-10">
      <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl text-[#1a3733] line-clamp-1">
              Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              filterKey="name"
              columns={columns}
              data={allReservations || []}
              // onDelete={(row) => {
              //   const ids = row.map((r) => (r.original as StaffMember)._id);
              //   deleteStaff({ ids });
              // }}
              // disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reservations
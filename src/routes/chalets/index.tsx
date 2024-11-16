import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetChalets } from "@/features/use-get-chalets";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

const Chalets = () => {
  const navigate = useNavigate();

  const { data: allChalets, isLoading } = useGetChalets();

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
        <title>Chalets</title>
      </Helmet>

      <div className="max-w-screen-2xl w-full pb-10">
      <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl text-[#1a3733] line-clamp-1">
              Chalets Page
            </CardTitle>
            <Button
              onClick={() => navigate("/admin/chalets/add-new-chalet")}
              className="bg-[#27534c] text-primary-foreground shadow hover:bg-[#1a3733]"
            >
              <Plus className="size-4 mr-2" />
              Add New Chalets
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              filterKey="name"
              columns={columns}
              data={allChalets || []}
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

export default Chalets
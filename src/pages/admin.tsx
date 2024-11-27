import MainLayout from "@/components/common";
import Chalets from "@/routes/chalets";
import AddChalet from "@/routes/chalets/add-chalet";

import NewChalet from "@/routes/chalets/add-new-chalets/newChalet";
import Customers from "@/routes/customers";
import Dashboard from "@/routes/dashboard";
import Payments from "@/routes/payments";
import Reservations from "@/routes/reservation";
import ViewReservationPage from "@/routes/reservation/view-reservation";
import { Route, Routes } from "react-router-dom";

const Admin = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chalets" element={<Chalets />} />
        <Route path="chalets/add-new-chalet" element={<AddChalet />} />
        <Route path="chalets/new-chalet" element={<NewChalet />} />
        
        <Route path="reservations" element={<Reservations />} />
        <Route path="reservations/view-reservation/:id" element={<ViewReservationPage />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />
      </Routes>
    </MainLayout>
  );
};

export default Admin;

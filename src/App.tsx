import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import SearchResults from "./routes/booking-search-results";
import ConfirmReservation from "./routes/reservation/confirm-reservation";
import BookedConfirmation from "./routes/reservation/reserve-confirmation";
import ChaletDetailPage from "./routes/view-chalet";
import HomePage from "./routes/homepage";
import ChaletDetail from "./routes/view-chalet/chalet-detail";
import BookingPage from "./routes/booking-page";

const Admin = lazy(() => import('./pages/admin'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/reservation/:id" element={<ConfirmReservation />} />
      <Route path="/reservation/confirmation" element={<BookedConfirmation />} />
      <Route path="/chalets/:id" element={<ChaletDetailPage />} />
      <Route path="/chalet-detail" element={<ChaletDetail />} />
      
      
      <Route path="/admin/*" element={<Admin />} />
    </>
  )
);

export const Loading = () => (
  <div className="bg-gray-50 text-gray-90 flex h-screen w-full items-center justify-center">
    <Loader2 />
  </div>
);

const App = () => (
  <Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;

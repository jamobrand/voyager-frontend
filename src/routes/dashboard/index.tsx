import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Home, Calendar } from 'lucide-react';
import { API_URL } from '@/config';

// TypeScript interfaces
interface RevenueMetric {
  status: string;
  _sum: {
    amount: string;
  };
}

interface ReservationStat {
  status: string;
  _count: number;
}

interface OccupancyData {
  chaletType: string;
  available: boolean;
  _count: {
    _all: number;
  };
}

interface UpcomingStay {
  id: number;
  checkIn: string;
  checkOut: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  chalet: {
    name: string;
  };
}

const Dashboard = () => {
  const [revenue, setRevenue] = useState<RevenueMetric[]>([]);
  const [reservations, setReservations] = useState<ReservationStat[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyData[]>([]);
  const [upcomingStays, setUpcomingStays] = useState<UpcomingStay[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const [revenueData, reservationData, occupancyData, staysData] = await Promise.all([
          fetch(`${API_URL}/v1/dashboard/metrics/revenue`).then(res => res.json()),
          fetch(`${API_URL}/v1/dashboard/metrics/reservations`).then(res => res.json()),
          fetch(`${API_URL}/v1/dashboard/metrics/occupancy`).then(res => res.json()),
          fetch(`${API_URL}/v1/dashboard/metrics/upcoming-stays`).then(res => res.json())
        ]);

        setRevenue(revenueData);
        setReservations(reservationData);
        setOccupancy(occupancyData);
        setUpcomingStays(staysData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRevenue = revenue.reduce<number>((acc, curr) => 
    acc + (parseFloat(curr._sum.amount) || 0), 0
  );

  const activeReservations = reservations.find(
    r => r.status === 'CHECKED_IN'
  )?._count || 0;

  const occupancyRate = occupancy.reduce((acc, curr) => 
    acc + curr._count._all, 0
  );

  console.log("upcomingStays", upcomingStays)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReservations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingStays.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="_sum.amount" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Chalet Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="chaletType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="_count.reservations" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Stays Table */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Stays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Guest</th>
                  <th className="px-4 py-2 text-left">Chalet</th>
                  <th className="px-4 py-2 text-left">Check-in</th>
                  <th className="px-4 py-2 text-left">Check-out</th>
                </tr>
              </thead>
              <tbody>
                {upcomingStays.map((stay) => (
                  <tr key={stay.id} className="border-b">
                    <td className="px-4 py-2">{`${stay.customer.firstName} ${stay.customer.lastName}`}</td>
                    <td className="px-4 py-2">{stay.chalet.name}</td>
                    <td className="px-4 py-2">{new Date(stay.checkIn).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(stay.checkOut).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
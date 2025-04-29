import { useEffect, useState } from 'react';
import { getUserStats, getPetStats } from './adminService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [petCount, setPetCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await getUserStats();
        setUserCount(userStats.userCount);

        const petStats = await getPetStats();
        setPetCount(petStats.petCount);
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err.message || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const data = [
    { name: 'Users', count: userCount },
    { name: 'Pets', count: petCount },
  ];

  const chartConfig = {
    Users: {
      label: 'Users',
      color: '#8884d8',
    },
    Pets: {
      label: 'Pets',
      color: '#82ca9d',
    },
  };

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="h-full">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>User and Pet Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ChartContainer config={chartConfig}>
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

import { useEffect, useState } from 'react';
import {
  getUserStats,
  getPetStats,
  getAdopterStats,
  getApplicationStats,
  getDocumentStats,
  getFosterStats,
  getLostFoundPetStats,
  getPetOwnerStats,
  getRescueShelterStats,
} from './adminService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [petCount, setPetCount] = useState(0);
  const [adopterCount, setAdopterCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [fosterCount, setFosterCount] = useState(0);
  const [lostFoundPetCount, setLostFoundPetCount] = useState(0);
  const [petOwnerCount, setPetOwnerCount] = useState(0);
  const [rescueShelterCount, setRescueShelterCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await getUserStats();
        setUserCount(userStats.userCount);

        const petStats = await getPetStats();
        setPetCount(petStats.petCount);

        const adopterStats = await getAdopterStats();
        setAdopterCount(adopterStats.adopterCount);

        const applicationStats = await getApplicationStats();
        setApplicationCount(applicationStats.applicationCount);

        const documentStats = await getDocumentStats();
        setDocumentCount(documentStats.documentCount);

        const fosterStats = await getFosterStats();
        setFosterCount(fosterStats.fosterCount);

        const lostFoundPetStats = await getLostFoundPetStats();
        setLostFoundPetCount(lostFoundPetStats.lostFoundPetCount);

        const petOwnerStats = await getPetOwnerStats();
        setPetOwnerCount(petOwnerStats.petOwnerCount);

        const rescueShelterStats = await getRescueShelterStats();
        setRescueShelterCount(rescueShelterStats.rescueShelterCount);

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
    { name: 'Adopters', count: adopterCount },
    { name: 'Applications', count: applicationCount },
    { name: 'Documents', count: documentCount },
    { name: 'Fosters', count: fosterCount },
    { name: 'Lost/Found Pets', count: lostFoundPetCount },
    { name: 'Pet Owners', count: petOwnerCount },
    { name: 'Rescue Shelters', count: rescueShelterCount },
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
    Adopters: {
      label: 'Adopters',
      color: '#ffc658',
    },
    Applications: {
      label: 'Applications',
      color: '#ff7300',
    },
    Documents: {
      label: 'Documents',
      color: '#00c49f',
    },
    Fosters: {
      label: 'Fosters',
      color: '#d0ed57',
    },
    'Lost/Found Pets': {
      label: 'Lost/Found Pets',
      color: '#83a6ed',
    },
    'Pet Owners': {
      label: 'Pet Owners',
      color: '#a4de6c',
    },
    'Rescue Shelters': {
      label: 'Rescue Shelters',
      color: '#e3a5b1',
    },
  };

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="h-full">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[...Array(9)].map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{userCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Pets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{petCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Adopters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{adopterCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{applicationCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{documentCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Fosters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{fosterCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Lost/Found Pets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{lostFoundPetCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Pet Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{petOwnerCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Rescue Shelters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{rescueShelterCount}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Overall Statistics Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    width={800}
                    height={400}
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
                    <Bar dataKey="count" fill="#8884d8" /> {/* Use a single bar for the count */}
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

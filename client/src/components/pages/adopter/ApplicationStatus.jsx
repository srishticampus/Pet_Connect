import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import api from '../../../utils/api'; // Assuming an API utility for requests
import { toast } from 'sonner'; // Using sonner for notifications

const AdopterApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/my-adoptions');
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching adopter applications:', err);
        setError('Failed to load your applications. Please try again later.');
        toast.error('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-lg pt-0">
              <Skeleton className="w-full h-48" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Adoption Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-600">You have not submitted any adoption applications yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <Card key={app._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 pt-0">
              <img
                src={app.pet?.Photo ?`${import.meta.env.VITE_API_URL}${app.pet.Photo}`: 'https://via.placeholder.com/300'} // Placeholder image
                alt={app.pet?.name || 'Pet Image'}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{app.pet?.name || 'Unknown Pet'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700"><strong>Application ID:</strong> {app._id}</p>
                <p className="text-gray-700"><strong>Status:</strong> <span className={`font-semibold ${
                  app.status === 'pending' ? 'text-yellow-600' :
                  app.status === 'approved' ? 'text-green-600' :
                  'text-red-600'
                }`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></p>
                {app.rejectionReason && (
                  <p className="text-red-500 text-sm mt-2"><strong>Reason for Rejection:</strong> {app.rejectionReason}</p>
                )}
                <div className="mt-4">
                  <Link to={`/pets/${app.pet?._id}`} className="w-full">
                    <Button className="w-full">View Pet Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdopterApplicationStatus;

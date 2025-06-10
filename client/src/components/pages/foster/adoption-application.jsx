import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Separator } from '../../ui/separator';
import { Skeleton } from '../../ui/skeleton';
import api from '../../../utils/api'; // Assuming api.js is the axios client

const AdoptionApplication = () => {
  const { applicationId } = useParams(); // Assuming the route will include an application ID
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        // TODO: Replace with actual API endpoint for fetching application details
        const response = await api.get(`/api/applications/${applicationId}`);
        setApplication(response.data);
      } catch (err) {
        setError('Failed to fetch application details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationDetails();
    } else {
      setError('No application ID provided.');
      setLoading(false);
    }
  }, [applicationId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-72 mb-6" />

        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="w-24 h-24 rounded-md" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!application) {
    return <div>Application not found.</div>;
  }

  const { foster, pet, rescueShelter } = application; // Assuming the API response structure

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Adoption/Foster Application</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Foster Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={foster?.image} alt={foster?.name} />
              <AvatarFallback>{foster?.name ? foster.name.charAt(0) : 'F'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{foster?.name}</p>
              <p className="text-sm text-gray-500">{foster?.email}</p>
            </div>
          </div>
          <p><strong>Phone Number:</strong> {foster?.phoneNumber}</p>
          <p><strong>Aadhar Card Number:</strong> {foster?.aadharNumber}</p>
          {/* TODO: Display Aadhar card image - might need a modal or separate view */}
          <p><strong>Place:</strong> {foster?.place}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <img src={`${import.meta.env.VITE_API_URL}${pet.Photo}`} alt={pet?.breed} className="w-24 h-24 object-cover rounded-md" />
            <div>
              <p className="text-lg font-semibold">{pet?.breed} ({pet?.species})</p>
              <p className="text-sm text-gray-500">Size: {pet?.size}, Age: {pet?.age}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rescue/Shelter Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {rescueShelter?.name}</p>
          <p><strong>Email:</strong> {rescueShelter?.email}</p>
          <p><strong>Phone Number:</strong> {rescueShelter?.phoneNumber}</p>
          <p><strong>Place:</strong> {rescueShelter?.place}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdoptionApplication;

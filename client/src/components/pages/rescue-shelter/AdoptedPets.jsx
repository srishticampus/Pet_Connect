import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Skeleton } from '../../ui/skeleton';
import api from '@/utils/api'; // Import the API client
import { useNavigate } from 'react-router'; // Import useNavigate

const AdoptedPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAdoptedPets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/rescue-shelter/adopted-pets');
        setPets(response.data);
      } catch (err) {
        console.error("Error fetching adopted pets:", err);
        setError("Failed to load adopted pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptedPets();
  }, []);

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.Breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (petId) => {
    navigate(`/pets/${petId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-lg rounded-lg pt-0">
              <Skeleton className="w-full h-48" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Adopted Pet</h1>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-lg border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredPets.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No adopted pets found.</p>
        ) : (
          filteredPets.map(pet => (
            <Card key={pet._id} className="overflow-hidden shadow-lg rounded-lg pt-0">
              <img src={pet.Photo && `${import.meta.env.VITE_API_URL}${pet.Photo}`} alt={pet.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{pet.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {pet.Breed} - {pet.Age} months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{pet.shortDescription}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => handleViewDetails(pet._id)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdoptedPets;

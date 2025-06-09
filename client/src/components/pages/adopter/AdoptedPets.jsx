import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Search } from 'lucide-react';
import api from '../../../utils/api'; // Assuming an API utility

const AdoptedPets = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdoptedPets = async () => {
      try {
        // Assuming an API endpoint for adopted pets
        const response = await api.get('/pets/adopted'); 
        setPets(response.data);
      } catch (err) {
        setError('Failed to fetch adopted pets. Please try again later.');
        console.error('Error fetching adopted pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptedPets();
  }, []);

  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    pet.Breed?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-lg py-0">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Adopted Pets</h1>
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-md border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map(pet => (
          <Card key={pet.id} className="overflow-hidden shadow-lg py-0">
            <img src={pet.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` : '/src/assets/dog.png'} alt={pet.name} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{pet.name}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Adopted
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{pet.breed} - {pet.age} months</p>
              <p className="text-gray-700 text-sm mb-4">
                {pet.description.substring(0, 70)}...
              </p>
              <Link to={`/pets/${pet._id}`}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdoptedPets;

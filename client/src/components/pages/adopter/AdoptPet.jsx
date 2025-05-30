import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Search } from 'lucide-react';
import api from '../../../utils/api'; // Assuming an API utility

const AdoptPet = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get('/pets/available-for-adoption'); // Use the existing endpoint
        setPets(response.data);
      } catch (err) {
        setError('Failed to fetch pets. Please try again later.');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    pet.Breed?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading pets...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Adopt a pet</h1>
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
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Available
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

export default AdoptPet;

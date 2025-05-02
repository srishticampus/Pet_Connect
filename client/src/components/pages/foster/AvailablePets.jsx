// client/src/components/pages/foster/AvailablePets.jsx
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router';
// Assuming an API service for foster features will be created
// import { getAvailablePets } from './fosterService';

const AvailablePets = () => {
  const [species, setSpecies] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dummy data for now, replace with API call later
  const dummyPets = [
    { id: 'pet1', photo: '/src/assets/dog.png', breed: 'Golden Retriever', species: 'Dog', age: '2 years' },
    { id: 'pet2', photo: '/src/assets/cardimg-1.png', breed: 'Siamese', species: 'Cat', age: '1 year' },
    { id: 'pet3', photo: '/src/assets/cardimg-2.png', breed: 'Parrot', species: 'Bird', age: '6 months' },
    { id: 'pet4', photo: '/src/assets/cardimg-3.png', breed: 'Beagle', species: 'Dog', age: '3 years' },
  ];

  useEffect(() => {
    // In a real scenario, fetch pets based on selected species
    setLoading(true);
    setError(null);
    // Replace with actual API call:
    // getAvailablePets(species)
    //   .then(data => setPets(data))
    //   .catch(err => setError(err))
    //   .finally(() => setLoading(false));

    // Using dummy data filtered by species for demonstration
    const filteredPets = species
      ? dummyPets.filter(pet => pet.species === species)
      : dummyPets;
    setPets(filteredPets);
    setLoading(false);

  }, [species]);

  const handleSpeciesChange = (value) => {
    // Convert empty string value from Select to null for "All Species"
    setSpecies(value === "" ? null : value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Available Pets for Foster Care</h1>

      <div className="mb-6">
        <label htmlFor="species-select" className="block text-sm font-medium text-gray-700 mb-2">Filter by Species:</label>
        <Select onValueChange={handleSpeciesChange} value={species}>
          <SelectTrigger id="species-select" className="w-[180px]">
            <SelectValue placeholder="Select Species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Species</SelectItem>
            <SelectItem value="Dog">Dog</SelectItem>
            <SelectItem value="Cat">Cat</SelectItem>
            <SelectItem value="Bird">Bird</SelectItem>
            {/* Add other species as needed */}
          </SelectContent>
        </Select>
      </div>

      {loading && <p>Loading pets...</p>}
      {error && <p className="text-red-500">Error loading pets: {error.message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map(pet => (
          <Card key={pet.id}>
            <CardHeader>
              <CardTitle>{pet.breed}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={pet.photo} alt={pet.breed} className="w-full h-48 object-cover mb-4 rounded" />
              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              <Link to={`/foster/apply/${pet.id}`}>
                <Button className="mt-4 w-full">View More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {pets.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">No pets available for the selected species.</p>
      )}
    </div>
  );
};

export default AvailablePets;
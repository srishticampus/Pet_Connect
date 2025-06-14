// client/src/components/pages/foster/AvailablePets.jsx
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router';
import { Skeleton } from "@/components/ui/skeleton";
// Assuming an API service for foster features will be created
import { getAvailablePets, getSpeciesList } from './fosterService';

const AvailablePets = () => {
  const [species, setSpecies] = useState('');
  const [availableSpecies, setAvailableSpecies] = useState([]); // New state for species list
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to fetch available pets based on selected species
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAvailablePets(species);
        setPets(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [species]);

  // Effect to fetch the list of available species when the component mounts
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const speciesList = await getSpeciesList();
        setAvailableSpecies(speciesList);
      } catch (err) {
        console.error("Error fetching species list:", err);
        // Optionally set an error state for species fetching
      }
    };

    fetchSpecies();
  }, []); // Empty dependency array means this effect runs once on mount

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
            {availableSpecies.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-48 mb-4 rounded" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {error && <p className="text-red-500">Error loading pets: {error.message}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map(pet => (
            <Card key={pet.id}>
              <CardHeader>
                <CardTitle>{pet.Breed}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={`${import.meta.env.VITE_API_URL}${pet.Photo}`} alt={pet.Breed} className="w-full h-48 object-cover mb-4 rounded" />
                <p><strong>Species:</strong> {pet.Species}</p>
                <p><strong>Age:</strong> {pet.Age}</p>
                <Link to={`/foster/apply/${pet._id}`}>
                  <Button className="mt-4 w-full">View More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pets.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">No pets available for the selected species.</p>
      )}
    </div>
  );
};

export default AvailablePets;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import api from '@/utils/api'; // Import the API client

const FosterPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFosterPets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/rescue-shelter/assigned-pets'); // Changed API endpoint
        setPets(response.data);
      } catch (err) {
        console.error("Error fetching foster pets:", err);
        setError("Failed to load foster pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFosterPets();
  }, []);

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.Breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading pets under foster care...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pets Under Foster Care</h1> {/* Changed title */}
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
          <p className="col-span-full text-center text-gray-500">No pets under foster care found.</p> 
        ) : (
          filteredPets.map(pet => (
            <Card key={pet._id} className="overflow-hidden shadow-lg rounded-lg pt-0">
              <img src={pet.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` : '/src/assets/dog.png'} alt={pet.name} className="w-full h-48 object-cover" />
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-6 bg-white rounded-lg shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Pet Details</DialogTitle>
                      <DialogDescription asChild>
                        <div className="flex flex-col lg:flex-row gap-6 mt-4">
                          <div className="flex-shrink-0">
                            <img src={pet.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` : '/src/assets/dog.png'} alt={pet.name} className="w-80 h-80 object-cover rounded-lg" />
                            {/* Thumbnails - assuming multiple photos are available in pet.Photo array or similar */}
                            <div className="flex gap-2 mt-2">
                              {/* {pet.Photos && pet.Photos.map((thumb, idx) => (
                                <img key={idx} src={thumb} alt={`thumbnail ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                              ))} */}
                              {/* Placeholder for now */}
                              <img src={pet.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` : '/src/assets/dog.png'} alt="thumbnail 1" className="w-20 h-20 object-cover rounded-lg" />
                              <img src={pet.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` : '/src/assets/dog.png'} alt="thumbnail 2" className="w-20 h-20 object-cover rounded-lg" />
                              <img src={pet.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` : '/src/assets/dog.png'} alt="thumbnail 3" className="w-20 h-20 object-cover rounded-lg" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h2 className="text-3xl font-bold mb-2">{pet.name}</h2>
                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                              <div className="flex items-center gap-2">
                                <img src="/src/assets/work-1.png" alt="age icon" className="h-5 w-5" /> {/* Placeholder icon */}
                                <span>Age: {pet.Age} months</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <img src="/src/assets/work-1.png" alt="gender icon" className="h-5 w-5" /> {/* Placeholder icon */}
                                <span>Gender: {pet.Gender}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <img src="/src/assets/work-1.png" alt="breed icon" className="h-5 w-5" /> {/* Placeholder icon */}
                                <span>Breed: {pet.Breed}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <img src="/src/assets/work-1.png" alt="size icon" className="h-5 w-5" /> {/* Placeholder icon */}
                                <span>Size: {pet.Size}</span>
                              </div>
                            </div>

                            <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
                            <p className="text-gray-700">{pet.description}</p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">Health & Vaccinations</h3>
                            <ul className="list-none p-0">
                              {pet.healthVaccinations && pet.healthVaccinations.map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-green-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {item}
                                </li>
                              ))}
                            </ul>

                            <Separator className="my-4" />

                            {/* Removed Lost Details and Updated By sections as they are not relevant for foster pets */}
                            {/* If petOwner details are needed, they can be displayed here */}
                            {pet.petOwner && (
                              <div>
                                <h3 className="text-xl font-semibold mb-2">Original Owner</h3>
                                <p className="text-gray-700">Name: {pet.petOwner.name}</p>
                                {/* Add other petOwner details if populated */}
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FosterPets;

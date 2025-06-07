import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Using Card for each pet
import petOwnerService from '@/components/pages/pet-owner/petOwnerService'; // Import petOwnerService
import { useNavigate } from 'react-router'; // Import useNavigate


const FindPet = () => {
  const [lostPets, setLostPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const fetchLostPets = async () => {
      try {
        const data = await petOwnerService.getOwnerLostPets();
        setLostPets(data);
      } catch (error) {
        console.error('Failed to fetch lost pets:', error);
        // Handle error (e.g., show an error message)
      } finally {
        setLoading(false);
      }
    };

    fetchLostPets();
  }, []);


  const handleAddPet = () => {
    // Navigate to the add lost pet page
    navigate('/pet-owner/add-lost-pet');
  };

  const handleEditPet = (pet) => {
    // Navigate to the edit lost pet page
    navigate(`/pet-owner/edit-lost-pet/${pet._id}`);
  };

  const handleMarkAsFound = async (petId) => {
    try {
      await petOwnerService.markPetAsFound(petId);
      // Update the status in the state for immediate display
      setLostPets(lostPets.map(pet => pet._id === petId ? { ...pet, status: 'found' } : pet));
    } catch (error) {
      console.error('Failed to mark pet as found:', error);
      // Handle error
    }
  };


  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Lost Pets</h1>
        <Button onClick={handleAddPet}>Add New Lost Pet</Button>
      </div>

      {loading ? (
        <p>Loading lost pets...</p>
      ) : lostPets.length === 0 ? (
        <p>You have not reported any lost pets yet.</p>
      ) : (
        <div className="flex flex-col gap-6 px-5">
          {lostPets.map((pet) => (
            <Card key={pet._id}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pet image */}
                  {pet.Photo && (
                    <img src={`${import.meta.env.VITE_API_URL}/${pet.Photo}`} alt={pet.name} className="w-full aspect-[611/567] object-cover rounded-2xl" />
                  )}

                  {/* Pet details */}
                  <div className="flex flex-col justify-between">
                    <h1 className="text-xl">{pet.name}</h1>
                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-4 py-4">
                      {/* Age */}
                      {pet.Age && (
                        <div className="flex gap-4 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cake">
                            <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
                            <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
                            <path d="M2 21h20" />
                            <path d="M7 8v3" />
                            <path d="M12 8v3" />
                            <path d="M17 8v3" />
                            <path d="M7 4h.01" />
                            <path d="M12 4h.01" />
                            <path d="M17 4h.01" />
                          </svg>
                          <div>
                            <p className="text-sm font-light text-[#7f7f7f]">Age</p>
                            <p>{pet.Age}</p>
                          </div>
                        </div>
                      )}
                      {/* Gender */}
                      {pet.Gender && (
                        <div className="flex gap-4 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-venus-and-mars">
                            <path d="M10 20h4" />
                            <path d="M12 16v6" />
                            <path d="M17 2h4v4" />
                            <path d="m21 2-5.46 5.46" />
                            <circle cx="12" cy="11" r="5" />
                          </svg>
                          <div>
                            <p className="text-sm font-light text-[#7f7f7f]">Gender</p>
                            <p>{pet.Gender}</p>
                          </div>
                        </div>
                      )}
                      {/* Breed */}
                      {pet.Breed && (
                        <div className="flex gap-4 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paw-print">
                            <circle cx="11" cy="4" r="2" />
                            <circle cx="18" cy="8" r="2" />
                            <circle cx="20" cy="16" r="2" />
                            <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
                          </svg>
                          <div>
                            <p className="text-sm font-light text-[#7f7f7f]">Breed</p>
                            <p>{pet.Breed}</p>
                          </div>
                        </div>
                      )}
                      {/* Size */}
                      {pet.Size && (
                        <div className="flex gap-4 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler">
                            <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
                            <path d="m14.5 12.5 2-2" />
                            <path d="m11.5 9.5 2-2" />
                            <path d="m8.5 6.5 2-2" />
                            <path d="m17.5 15.5 2-2" />
                          </svg>
                          <div>
                            <p className="text-sm font-light text-[#7f7f7f]">Size</p>
                            <p>{pet.Size}</p>
                          </div>
                        </div>
                      )}
                       {/* Status - Keep status as it's relevant for lost pets */}
                       {pet.status && (
                        <div className="flex gap-4 items-center">
                          <div>
                            <p className="text-sm font-light text-[#7f7f7f]">Status</p>
                            <p>{pet.status}</p>
                          </div>
                        </div>
                       )}
                    </div>

                    {/* Description */}
                    {pet.description && (
                      <>
                        <p className="pb-2">Description</p>
                        <p className="text-sm font-light ">
                          {pet.description}
                        </p>
                      </>
                    )}

                    {/* Health & Vaccinations */}
                    {pet.healthVaccinations && pet.healthVaccinations.length > 0 && (
                      <>
                        <p className="pt-6">Health & Vaccinations</p>
                        <ul className="text-sm font-light py-4 bullets">
                          {pet.healthVaccinations.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* Buttons - Use the buttons from find-pet.jsx */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditPet(pet)}>Edit</Button>
                      {pet.status === 'lost' && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsFound(pet._id)}>Mark as Found</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindPet;

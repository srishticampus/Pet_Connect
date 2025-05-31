import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router'; // Import useNavigate
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import api from '../../../utils/api'; // Assuming an API utility for requests
import { toast } from 'sonner'; // For notifications

const AssignedPets = () => {
  const [assignedPets, setAssignedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAssignedPets = async () => {
      try {
        const response = await api.get('/foster/assigned-pets');
        setAssignedPets(response.data);
      } catch (err) {
        console.error('Error fetching assigned pets:', err);
        setError('Failed to load assigned pets. Please try again later.');
        toast.error('Failed to load assigned pets.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPets();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading assigned pets...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Assigned Pets</h1>
      {assignedPets.length === 0 ? (
        <p className="text-gray-600">You currently have no pets assigned for fostering.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedPets.map((pet) => (
            <Card key={pet._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={pet.Photo?`${import.meta.env.VITE_API_URL}${pet.Photo}` : 'https://via.placeholder.com/300'} // Placeholder image
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{pet.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700"><strong>Species:</strong> {pet.Species}</p>
                <p className="text-gray-700"><strong>Breed:</strong> {pet.Breed}</p>
                <p className="text-gray-700"><strong>Gender:</strong> {pet.Gender}</p>
                <p className="text-gray-700"><strong>Age:</strong> {pet.Age} years</p>
                <p className="text-gray-700"><strong>Size:</strong> {pet.Size}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link to={`/foster/pets/${pet._id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                  {pet.petOwner?._id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/chat?initialChatPartnerId=${pet.petOwner._id}&chatTargetRole=rescue-shelter`)}
                    >
                      Chat with Rescue/Shelter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedPets;

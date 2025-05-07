import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { Link, useNavigate } from 'react-router';
import Pet from '@/components/pet';
import petOwnerService from './petOwnerService'; // Import the petOwnerService

const ManagePets = () => {
  const [userPets, setUserPets] = useState([]); // State for fetched pets
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  const navigate = useNavigate();

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petOwnerService.deletePet(petId);
        // Remove the deleted pet from the state
        setUserPets(userPets.filter(pet => pet._id !== petId));
      } catch (err) {
        setError(err.message);
        console.error('Error deleting pet:', err);
      }
    }
  };

  const handleEditPet = (petId) => {
    navigate(`/pet-owner/edit-pet/${petId}`);
  };

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const response = await petOwnerService.getUserPets(); // Use petOwnerService to fetch user pets
        setUserPets(response); // petOwnerService returns the data directly
      } catch (err) {
        setError(err.message);
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPets();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <section className="container mx-auto px-4 lg:px-0 py-8">Loading pets...</section>;
  }

  if (error) {
    return <section className="container mx-auto px-4 lg:px-0 py-8 text-red-500">Error: {error}</section>;
  }

  return (
    <section className="container mx-auto px-4 lg:px-0 py-8">
      <div className="flex justify-between mb-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Your Pets</h1>
        <Link to="/pet-owner/add-pet">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80">
            Add New Pet
          </button>
        </Link>
      </div>
      <div className="border rounded-lg p-4 bg-white shadow-md">
        {userPets.length > 0 ? (
          userPets
            .filter(pet => pet.status === 'active') // Filter out lost/found pets
            .map(pet => (
            // Pet component will need to be adapted to accept pet data as props
            <Pet
              key={pet._id}
              pet={pet}
              onEdit={() => handleEditPet(pet._id)}
              onDelete={() => handleDeletePet(pet._id)}
            /> // Use pet._id for the key
          ))
        ) : (
          <p>You don't have any pets listed yet.</p>
        )}
      </div>
    </section>
  );
};


export default ManagePets;
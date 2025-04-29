import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { Link } from 'react-router';
import Pet from '@/components/pet';
import api from '@/utils/api'; // Import the api service

const ManagePets = () => {
  const [userPets, setUserPets] = useState([]); // State for fetched pets
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const response = await api.get('/pets/'); // Use api.get to fetch pets
        setUserPets(response.data); // Axios puts the response data in .data
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
      <h1 className="text-2xl font-semibold mb-6">Manage Your Pets</h1>
      <div className="flex justify-end mb-6">
        <Link to="/pet-owner/add-pet">
          <button className="bg-[#e54c00] text-white px-4 py-2 rounded-md hover:bg-[#ED824D]">
            Add New Pet
          </button>
        </Link>
      </div>
      <div className="border rounded-lg p-4 bg-white shadow-md">
        {userPets.length > 0 ? (
          userPets.map(pet => (
            // Pet component will need to be adapted to accept pet data as props
            <Pet key={pet._id} pet={pet} /> // Use pet._id for the key
          ))
        ) : (
          <p>You don't have any pets listed yet.</p>
        )}
      </div>
    </section>
  );
};

export default ManagePets;
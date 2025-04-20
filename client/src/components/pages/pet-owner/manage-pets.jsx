import React from 'react';
import { Link } from 'react-router'; // Assuming react-router based on layout.jsx
import Pet from '@/components/pet';

const ManagePets = () => {
  const userPets = [{
    id: 1,
    image: '/client/src/assets/cardimg-1.png', // Using a sample image from the project
    name: 'Buddy',
    age: '3 years',
    gender: 'Male',
    breed: 'Golden Retriever',
    size: 'Large',
    description: 'Buddy is a friendly and energetic dog looking for a loving home.',
    healthVaccinations: ['Rabies', 'Distemper']
  }]; // Placeholder for fetched pets

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
            <Pet key={pet.id} pet={pet} />
          ))
        ) : (
          <p>You don't have any pets listed yet.</p>
        )}
      </div>
    </section>
  );
};

export default ManagePets;
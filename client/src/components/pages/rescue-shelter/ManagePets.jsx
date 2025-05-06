import React, { useEffect, useState } from 'react';
import { getMyPets, deletePet } from './rescueShelterService'; // Assuming the service file is in the same directory
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router';

const ManagePets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await getMyPets();
                setPets(data);
            } catch (err) {
                console.error('Error fetching pets:', err);
                setError('Failed to fetch pets. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pet?')) {
            try {
                await deletePet(id);
                // Remove the deleted pet from the state
                setPets(pets.filter(pet => pet._id !== id));
            } catch (err) {
                console.error('Error deleting pet:', err);
                setError('Failed to delete pet. Please try again.');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/rescue-shelter/edit-pet/${id}`); // Navigate to edit pet page
    };

    if (loading) {
        return <div>Loading pets...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <section className="container mx-auto px-4 lg:px-0 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold ">Manage Pets for adoption</h1>
                <div className="flex justify-end ">
                    <Link to="/rescue-shelter/add-pet">
                        <button className="bg-[#e54c00] text-white px-4 py-2 rounded-md hover:bg-[#ED824D]">
                            Add New Pet
                        </button>
                    </Link>
                </div>
            </div>
            {pets.length === 0 ? (
                <p>You haven't added any pets yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map(pet => (
                        <div key={pet._id} className="border rounded-lg p-4">
                            <h3 className="text-xl font-semibold">{pet.name}</h3>
                            <p>Species: {pet.Species}</p>
                            <p>Breed: {pet.Breed}</p>
                            {/* Add more pet details here */}
                            <div className="mt-4 flex space-x-2">
                                <Button onClick={() => handleEdit(pet._id)} variant="outline">Edit</Button>
                                <Button onClick={() => handleDelete(pet._id)} variant="destructive">Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ManagePets;
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
                        <button className="bg-[#e54c00] text-white hover:bg-[#ED824D] px-6 py-3 rounded-full font-semibold">
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
                        <div key={pet._id} className="rounded-xl overflow-hidden shadow-md bg-white">
                            <img
                                src={pet?.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` :"https://placedog.net/500/300"} // Placeholder image URL
                                alt={`Image of ${pet.name}`}
                                className="w-full h-60 object-cover"
                            />
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">{pet.name}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Available</span>
                                </div>
                                <p className="text-gray-500 text-sm">{pet.Breed} - 8 months</p>
                                <p className="mt-2 text-gray-700">
                                    {pet.description}
                                </p>
                                <Button asChild>
                                    <Link to={`/rescue-shelter/edit-pet/${pet._id}`} className="mt-4 text-[#e54c00]  w-full bg-primary font-semibold">View Details</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ManagePets;
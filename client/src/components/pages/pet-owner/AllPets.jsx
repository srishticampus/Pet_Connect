import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";

export default function AllPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailablePets = async () => {
      try {
        const response = await api.get("/pets/available-for-adoption"); // Fetch pets available for adoption
        setPets(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pets.");
        setLoading(false);
        console.error("Failed to fetch available pets:", err);
      }
    };

    fetchAvailablePets();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading pets...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <h1 className="text-4xl my-8 font-semibold text-center">
        All Available <span className="text-[#e54c00]">Companions</span>
      </h1>
      <p className="text-center mb-8 text-lg font-light text-gray-600">
        Browse all pets currently available for adoption or foster.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet._id} className="w-full">
              <div className="card bg-white rounded-2xl">
                <div className="img">
                  <img
                    src={pet.Photo ? import.meta.env.VITE_API_URL + pet.Photo : ""}
                    alt={pet.name}
                    className="w-full aspect-[137/115] object-cover rounded-t-2xl"
                  />
                </div>
                <div className="content p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{pet.name}</h3>
                    {pet.availableForAdoptionOrFoster && (
                      <div className="bg-[#4CAF50] text-white rounded-2xl text-[0.6rem] px-1.5 py-0.5">
                        Available
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#4c4c4c] py-1">
                    {pet.Breed} •{" "}
                    <span className="text-[#7f7f7f]">{pet.Age}</span>
                  </p>
                  <p className="text-xs font-light text-[#4c4c4c] py-1">
                    {pet.description}
                  </p>
                  <Link to={`/pet-owner/pets/${pet._id}`}>
                    <Button className="w-full mt-3">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">No pets found.</div>
        )}
      </div>
    </main>
  );
}
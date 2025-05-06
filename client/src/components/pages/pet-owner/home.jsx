import { Link } from "react-router";
import { useEffect, useState } from "react"; // Import useEffect and useState

import hero from "@/assets/hero.png";
import cardimg3 from "@/assets/cardimg-3.png";
import work1 from "@/assets/work-1.png";
import work2 from "@/assets/work-2.png";
import work3 from "@/assets/work-3.png";
import dog from "@/assets/dog.png";
import { Button } from "@/components/ui/button";
import api from "@/utils/api"; // Import the api utility

export default function HomePage() {
  const stats = [
    { value: "400+", label: "Successful Adoptions" },
    { value: "200+", label: "Volunteers" },
    { value: "8+", label: "Years" },
    { value: "20k+", label: "Pets Rescued" },
  ];

  const [pets, setPets] = useState([]); // State to hold fetched pets

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get("/pets/available-for-adoption"); // Fetch pets available for adoption
        setPets(response.data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    };

    fetchPets();
  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 py-16">
          <div className="md:w-1/2">
            <p>YOUR ONE-STEP</p>
            <h1 className="text-5xl font-semibold leading-snug">
              Platform for Pet
              <br />
              <span className="text-[#E54C00]">Adoption &amp; Rescue!</span>
            </h1>
            <p className="text-lg font-light mt-2">
              Whether you're looking to adopt, foster, or reunite a lost pet,
              Pet Connect makes the process seamless and efficient.
            </p>
          </div>
          <div className="md:w-1/2 relative ">
            <img
              src={hero}
              alt="Happy dog"
              fill
              className="rounded-2xl aspect-[16/11] object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4">
              <p className="text-4xl text-[#E54C00] font-semibold">
                {stat.value}
              </p>
              <p className="text-lg font-light">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-3 lg:px-0 container mx-auto py-4 my-16">
        <h2 className="text-4xl my-8 font-semibold text-center">
          Find Your Perfect <span className="text-[#e54c00]">Companion</span>
        </h2>
        <p className="text-center mb-8 text-lg font-light text-gray-600">
          Give a rescued pet a loving home. Browse available pets and start your
          adoption journey today!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pets.map((pet) => ( // Map over the fetched pets
            <div key={pet._id} className="w-full"> {/* Use pet._id as key */}
              <div className="card bg-white rounded-2xl">
                <div className="img">
                  <img
                    src={pet.Photo ? import.meta.env.VITE_API_URL + pet.Photo : ""} // Use pet.name for alt text
                    alt={pet.name} // Use pet.name for alt text
                    className="w-full aspect-[137/115] object-cover rounded-t-2xl"
                  />
                </div>
                <div className="content p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{pet.name}</h3> {/* Use pet.name */}
                    {/*badge*/}
                    {pet.availableForAdoptionOrFoster && ( // Conditionally render badge
                      <div className="bg-[#4CAF50] text-white rounded-2xl text-[0.6rem] px-1.5 py-0.5">
                        Available
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#4c4c4c] py-1">
                    {pet.Breed} •{" "} {/* Use pet.Breed */}
                    <span className="text-[#7f7f7f]">{pet.Age}</span> {/* Use pet.Age */}
                  </p>
                  <p className="text-xs font-light text-[#4c4c4c] py-1">
                    {pet.description} {/* Use pet.description */}
                  </p>
                  <Button
                    className="w-full mt-3"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <a
          href="/pets"
          className="text-center text-sm font-light text-[#e54c00] underline float-end mt-8"
        >
          View More
        </a>
      </section>

      <section className="container mx-auto px-3 lg:px-0 py-8">
        <h2 className="text-2xl font-semibold text-center mb-12 text-[#e54c00]">
          How it works
        </h2>
        <div className="flex flex-col md:flex-row justify-evenly text-center my-8 gap-4">
          <div className="flex flex-col items-center">
            <img
              src={work1}
              alt="dog"
              className="w-24 h-24 object-cover object-center mb-3"
            />
            <h3 className="text-xl text-[#4c4c4c] font-semibold mb-4">
              Report a Stray Pet
            </h3>
            <p className="text-sm">
              Spotted an animal in need? Upload a photo and location details to
              alert our rescue team. Every report helps save a life.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={work2}
              alt="dog"
              className="w-24 h-24 object-cover object-center mb-3"
            />
            <h3 className="text-xl text-[#4c4c4c] font-semibold mb-4">
              Volunteers Take Action
            </h3>
            <p className="text-sm">
              Our dedicated volunteers step in! Once verified, our team quickly
              reaches the pet’s location, ensuring safe rescue and care.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={work3}
              alt="dog"
              className="w-24 h-24 object-cover object-center mb-3"
            />
            <h3 className="text-xl text-[#4c4c4c] font-semibold mb-4">
              Find a Loving Home
            </h3>
            <p className="text-sm">
              After recovery, pets are ready for adoption. We connect them with
              loving families, ensuring a happy and secure future.
            </p>
          </div>
        </div>
      </section>

      {/* <!-- cta banner --> */}
      <section className="container mx-auto px-3 lg:px-0 py-8">
        <div className="relative p-12  text-white rounded-2xl flex flex-col gap-6 items-start overflow-hidden">
          <div className="cta-gradient -m-12 p-12 w-full h-full absolute z-1">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold">
                Heroes Without Capes, Join Our Volunteers & Save Innocent Lives
                Today!
              </h3>
            </div>
            <Link
              to="/"
              className="bg-white w-fit mt-3 text-[#e54c00] px-6 py-2 rounded-full flex text-sm gap-2 items-center"
            >
              Register Now{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-move-right"
              >
                <path d="M18 8L22 12L18 16" />
                <path d="M2 12H22" />
              </svg>
            </Link>
          </div>
          <div className="absolute w-full h-full  inset-0 z-0">
            <img
              src={cardimg3}
              alt="volunteer helping a dog"
              className="md:w-1/2 h-full object-cover object-top right-0 absolute rotate-y-180"
            />
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold">
              Heroes Without Capes, Join Our Volunteers & Save Innocent Lives
              Today!
            </h3>
          </div>
          <button className="bg-white text-[#e54c00] px-6 py-2 rounded-full flex text-sm gap-2 items-center">
            Register Now{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-move-right"
            >
              <path d="M18 8L22 12L18 16" />
              <path d="M2 12H22" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
}

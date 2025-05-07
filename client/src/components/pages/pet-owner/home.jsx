import { Link } from "react-router";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { ArrowUpRight } from "lucide-react"; // Added from index.jsx

import hero from "@/assets/hero.png";
import cardimg1 from "@/assets/cardimg-1.png"; // Added from index.jsx
import cardimg2 from "@/assets/cardimg-2.png"; // Added from index.jsx
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

  const howItWorks = [
    {
      image: work3,
      title: "Discover & Connect",
      content:
        "Browse through verified pet profiles or report a lost/found pet. Use AI-powered breed detection for easy identification.",
    },
    {
      image: work1,
      title: "Apply & Communicate",
      content:
        "Submit an adoption or foster application in just a few clicks. Chat with shelters, rescues, or pet owners in real time.",
    },
    {
      image:  work2,
      title: "Report a Stray Pet",
      content:
        "Complete the adoption or fostering process and bring home a loving companion with joy!",
    },
  ];

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
              <span className="text-[#E54C00]">Adoption & Rescue!</span>
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

      {/* Find Your Perfect Companion Section (from home.jsx) */}
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
                  <Link to={`/pet-owner/pets/${pet._id}`}>
                    <Button
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/pet-owner/all-pets"
          className="text-center text-sm font-light text-[#e54c00] underline float-end mt-8"
        >
          View More
        </Link>
      </section>

      {/* How it works section (from index.jsx) */}
      <section className="container mx-auto px-3 lg:px-0 py-8">
        <h2 className="text-2xl font-semibold text-center mb-12 text-[#e54c00]">
          How it works
        </h2>
        <div className="flex flex-col md:flex-row justify-evenly text-center my-8 gap-4">
          {howItWorks.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={item.image}
                alt="dog"
                className="w-24 h-24 object-cover object-center mb-3"
              />
              <h3 className="text-xl text-[#4c4c4c] font-semibold mb-4">
                {item.title}
              </h3>
              <p className="text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* cta banner (from index.jsx - corrected) */}
      <section className="container mx-auto px-3 lg:px-0 py-8">
        <div className="relative p-12  text-white rounded-2xl flex flex-col gap-6 items-start overflow-hidden">
          <div className="cta-gradient -m-12 p-12 w-full h-full absolute z-1">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold">
                Be a part of a compassionate network dedicated to pet rescue, adoption, and fostering. Whether you're looking to adopt, foster, or help reunite lost pets, your support makes a difference!
              </h3>
            </div>
            <Link
              to="/register"
              className="bg-white w-fit mt-3 text-[#e54c00] px-6 py-2 rounded-full flex text-sm gap-2 items-center"
            >
              Join Us Today!{" "}
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
        </div>
      </section>
    </main>
  );
}

import React from 'react';

const Pet = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="w-full mx-auto grid grid-cols-1 gap-4 border rounded-lg p-4 bg-white shadow-md">
      {/* Pet image */}
      <img src={`${import.meta.env.VITE_API_URL}${pet.Photo}`} alt={pet.name} className="w-full h-48 object-cover rounded-lg" />

      {/* Pet details */}
      <div className="flex flex-col justify-between">
        <h1 className="text-xl">{pet.name}</h1>
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 py-4">
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
        </div>

        <div className="flex gap-4 items-center">
          {/* <p className="text-sm font-light text-[#7f7f7f]">Origin</p>
          <p>{pet.origin === "owner" ? "Owner" : "Foster"}</p> */}
        </div>

        <p className="pb-2">Description</p>
        <p className="text-sm font-light ">
          {pet.description}
        </p>
        <p className="pt-6">Health & Vaccinations</p>
        <ul className="text-sm font-light py-4 bullets">
          {pet.healthVaccinations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {/* Action buttons */}
        <div className="flex items-center gap-4 mt-auto">
          <button
            onClick={onEdit}
            className="mt-auto text-primary outline outline-primary px-4 py-2 rounded-4xl w-full hover:cursor-pointer hover:bg-primary/30 "
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="mt-auto bg-primary text-white px-4 py-2 rounded-4xl w-full hover:cursor-pointer hover:bg-primary/90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pet;

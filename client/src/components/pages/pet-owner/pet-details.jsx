import React from 'react';
import dog from "@/assets/dog.png"
const PetDetails = () => {
  return (
    <section className="container mx-auto px-3 lg:px-0 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pet image */}
        <img src={dog} alt="dog food" className="w-full aspect-[611/567] object-cover rounded-2xl" />

        {/* Pet details */}
        <div>
          <h1 className="text-xl">Max</h1>
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
                <p>8 months</p>
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
                <p>Female</p>
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
                <p>Golden Retriever</p>
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
                <p>Medium</p>
              </div>
            </div>
          </div>

          <p className="pb-2">Description</p>
          <p className="text-sm font-light ">
            Max is a loving and energetic Golden Retriever puppy who adores people and other dogs. She's
            incredibly smart and already knows basic commands. Luna would thrive in an active family
            that can
            provide her with plenty of exercise and mental stimulation.
          </p>
          <p className="pt-6">Health &amp; Vaccinations</p>
          <ul className="text-sm font-light py-4 bullets">
            <li>Fully vaccinated</li>
            <li>Spayed</li>
            <li>Microchipped</li>
          </ul>
          {/* Apply to Adopt button */}
          <div className="flex items-center gap-4">
            <button className="bg-[#e54c00] text-white px-4 py-2 rounded-4xl w-full hover:cursor-pointer hover:bg-[#ED824D]">
              Apply to Adopt
            </button>
          </div>
        </div>
      </div>

      {/* Adoption Process */}
      <section className="px-3 lg:px-0 container mx-auto py-4 text-[#4c4c4c]">
        <h2 className="text-xl font-medium py-4">Adoption Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4">
            <div className="text-[#e54c00] bg-[#E54C0033] rounded-full w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text m-2">
                <path d="M15 12h-5" />
                <path d="M15 8h-5" />
                <path d="M19 17V5a2 2 0 0 0-2-2H4" />
                <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
              </svg>
            </div>
            <h2 className="py-4"> 1. Submit Application</h2>
            <p className="text-sm text-[#7f7f7f]">Fill out our comprehensive adoption application form.</p>
          </div>
          <div className="bg-white p-4">
            <div className="text-[#e54c00] bg-[#E54C0033] rounded-full w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headset">
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
              </svg>
            </div>
            <h2 className="py-4"> 2. Initial Interview</h2>
            <p className="text-sm text-[#7f7f7f]">We'll schedule a phone call to discuss your application.</p>
          </div>
          <div className="bg-white p-4">
            <div className="text-[#e54c00] bg-[#E54C0033] rounded-full w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            <h2 className="py-4"> 3. Home Check</h2>
            <p className="text-sm text-[#7f7f7f]">A quick visit to ensure your home is pet-ready.</p>
          </div>
          <div className="bg-white p-4">
            <div className="text-[#e54c00] bg-[#E54C0033] rounded-full w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="py-4"> 4. Welcome Home</h2>
            <p className="text-sm text-[#7f7f7f]">Complete the adoption and welcome your new family member!</p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default PetDetails;

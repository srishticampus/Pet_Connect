import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '@/utils/api'; // Import the api utility
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner'; // Using sonner for notifications
import { useAuth } from '../../hooks/auth'; // Import useAuth to check user role
import { useNavigate } from 'react-router'; // Import useNavigate
import { Skeleton } from "@/components/ui/skeleton";

const PetDetailsPage = () => {
  const { petId } = useParams(); // Get petId from URL
  const [pet, setPet] = useState(null); // State to hold fetched pet details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    confirmAdoption: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const { user, isAuthenticated } = useAuth(); // Get current user and auth status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/pets/${petId}`); // Fetch pet details by ID
        setPet(response.data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch pet details:", err);
        toast.error("Failed to load pet details.");
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchPetDetails();
    }
  }, [petId]); // Re-run effect if petId changes

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    console.log("Submitting adoption application for pet:", petId, "with data:", formData);

    try {
      const response = await api.post(`/applications/adopt/${petId}`, formData);
      console.log("Application submitted successfully:", response.data);
      setSubmitSuccess(true);
      setIsDialogOpen(false); // Close dialog on successful submission
      setFormData({ message: '', confirmAdoption: false }); // Reset form
      toast.success("Adoption application submitted successfully!");
    } catch (err) {
      console.error("Failed to submit application:", err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
      setSubmitError({ message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChatWithShelter = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to chat with the rescue/shelter.");
      navigate('/login');
      return;
    }
    if (pet?.petOwner?._id) {
      // Navigate to the chat interface, passing the rescue shelter's ID
      navigate(`/chat?initialChatPartnerId=${pet.petOwner._id}&chatTargetRole=rescue-shelter`);
    } else {
      toast.error("Rescue/Shelter information not available for chat.");
    }
  };


  if (loading) {
    return (
      <main className="container mx-auto px-3 lg:px-0 py-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pet image skeleton */}
          <Skeleton className="w-full aspect-[611/567] rounded-2xl h-[400px]" />

          {/* Pet details skeleton */}
          <div className="flex flex-col justify-between space-y-4">
            <Skeleton className="h-8 w-3/4" /> {/* Title */}
            <div className="grid grid-cols-2 gap-4 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" /> {/* Label */}
                    <Skeleton className="h-5 w-24" /> {/* Value */}
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-4 w-24" /> {/* Description label */}
            <Skeleton className="h-20 w-full" /> {/* Description text */}
            <Skeleton className="h-4 w-32 mt-6" /> {/* Health & Vaccinations label */}
            <Skeleton className="h-16 w-full" /> {/* Health & Vaccinations list */}
            <Skeleton className="h-10 w-full mt-4" /> {/* Button */}
          </div>
        </div>
        <section className="px-3 lg:px-0 container mx-auto py-4 text-[#4c4c4c]">
          <Skeleton className="h-6 w-48 py-4" /> {/* Adoption Process title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 space-y-2">
                <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon container */}
                <Skeleton className="h-6 w-3/4" /> {/* Title */}
                <Skeleton className="h-12 w-full" /> {/* Description */}
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">Error loading pet details: {error.message}</div>;
  }

  if (!pet) {
    return <div className="container mx-auto py-8">Pet not found.</div>;
  }

  return (
    <main className="container mx-auto px-3 lg:px-0 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pet image */}
        <img src={`${import.meta.env.VITE_API_URL}${pet.Photo}`} alt={pet.name} className="w-full aspect-[611/567] object-cover rounded-2xl" />

        {/* Pet details */}
        <div className="flex flex-col justify-between">
          <h1 className="text-3xl font-bold">{pet.name}</h1>
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

          <p className="pb-2">Description</p>
          <p className="text-sm font-light ">
            {pet.description}
          </p>
          {pet.healthVaccinations && pet.healthVaccinations.length > 0 && (
            <>
              <p className="pt-6">Health & Vaccinations</p>
              <ul className="text-sm font-light py-4 bullets">
                {pet.healthVaccinations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Conditional Buttons based on user role */}
          {!pet.isAdopted && isAuthenticated && user?.role === 'adopter' && (
            <div className="flex flex-col gap-4 mt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Apply to Adopt</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adoption Application</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to apply to adopt this pet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="message">Tell us about yourself and why you want to adopt this pet:</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="confirmAdoption"
                          name="confirmAdoption"
                          checked={formData.confirmAdoption}
                          onCheckedChange={(checked) => setFormData({...formData, confirmAdoption: checked})}
                          required
                        />
                        <Label htmlFor="confirmAdoption">
                          I confirm I am ready to adopt this pet and provide a loving home.
                        </Label>
                      </div>

                      {submitError && <p className="text-red-500">Error submitting application: {submitError.message}</p>}
                      {submitSuccess && <p className="text-green-500">Application submitted successfully!</p>}

                      <Button type="submit" disabled={submitting || !formData.confirmAdoption}>
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
              {pet.petOwner?._id && (
                <Button variant="outline" className="w-full" onClick={handleChatWithShelter}>
                  Contact Rescue/Shelter
                </Button>
              )}
            </div>
          )}
          {/* If not authenticated or not an adopter, show only view details or other general actions */}
          {!isAuthenticated && (
            <div className="mt-4">
              <Button className="w-full" onClick={() => toast.info("Please log in to apply or chat.")}>
                Log in to Interact
              </Button>
            </div>
          )}
          {pet.isAdopted && pet.status !== 'fostered' && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-green-600">This pet has been adopted!</p>
            </div>
          )}
          {pet.status === 'fostered' && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-green-600">This pet has been fostered!</p>
            </div>
          )}
        </div>
      </div>

      {/* Adoption Process */}
      {!pet.isAdopted && user?.role !== 'rescue-shelter' && (
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
      )}
    </main>
  );
};

export default PetDetailsPage;

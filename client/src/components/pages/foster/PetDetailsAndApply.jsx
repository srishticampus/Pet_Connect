// client/src/components/pages/foster/PetDetailsAndApply.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Keep Input for other fields if needed
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover components
import { format } from "date-fns"; // Import format from date-fns
import { Calendar as CalendarIcon } from "lucide-react"; // Import CalendarIcon
import { cn } from "@/lib/utils"; // Import cn utility
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components

// Assuming an API service for foster features will be created
import { getPetDetails, applyToFoster } from './fosterService';

const PetDetailsAndApply = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fromDate: undefined, // Use undefined for initial state with shadcn calendar
    toDate: undefined,
    policyApproved: false,
    // Add other form fields if necessary
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility


  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPetDetails(petId);
        setPet(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();

  }, [petId]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log('Submitting formData:', formData); // Log formData before sending
      await applyToFoster(petId, formData);
      setSubmitSuccess(true);
      setIsDialogOpen(false); // Close dialog on successful submission
    } catch (err) {
      // the server sends {msg:""}
      setSubmitError(err?.response?.data?.msg || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading pet details...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">Error loading pet details: {error.message}</div>;
  }

  if (!pet) {
    return <div className="container mx-auto py-8">Pet not found.</div>;
  }

  return (
    <section className="container mx-auto px-3 lg:px-0 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pet image */}
        <img src={`${import.meta.env.VITE_API_URL}${pet.Photo}`} alt={pet.Breed} className="w-full aspect-[611/567] object-cover rounded-2xl" />

        {/* Pet details */}
        <div className="flex flex-col justify-between">
          <h1 className="text-xl">{pet.Breed}</h1> {/* Using breed as title for now */}
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
              {/* Assuming gender is not available in current pet data, using species icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paw-print">
                <circle cx="11" cy="4" r="2" />
                <circle cx="18" cy="8" r="2" />
                <circle cx="20" cy="16" r="2" />
                <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
              </svg>
              <div>
                <p className="text-sm font-light text-[#7f7f7f]">Species</p>
                <p>{pet.Species}</p>
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

          {/* Assuming description is not available in current pet data */}
          {/* <p className="pb-2">Description</p>
          <p className="text-sm font-light ">
            Max is a loving and energetic Golden Retriever puppy who adores people and other dogs. She's
            incredibly smart and already knows basic commands. Luna would thrive in an active family
            that can
            provide her with plenty of exercise and mental stimulation.
          </p> */}
          <p className="pt-6">Health Status</p> {/* Changed from Health & Vaccinations */}
          <ul className="text-sm font-light py-4 bullets">
            {pet.healthVaccinations && pet.healthVaccinations.map((status, index) => (
              <li key={index}>{status}</li>
            ))}
          </ul>
                {/* Foster Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
        <DialogTrigger asChild>
          <Button className="mt-4 w-full">Apply to Foster</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] z-30">
          <DialogHeader>
            <DialogTitle>Foster Application</DialogTitle>
            <DialogDescription>
              Fill out the form below to apply to foster this pet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4"> {/* Use a div for spacing instead of Card */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fromDate">Foster Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fromDate ? format(formData.fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fromDate}
                      onSelect={(date) => handleDateSelect(date, 'fromDate')}
                      initialFocus
                      disabled={(date) => date < new Date()} // Disable dates before today
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="toDate">Foster End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.toDate ? format(formData.toDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.toDate}
                      onSelect={(date) => handleDateSelect(date, 'toDate')}
                      initialFocus
                      disabled={(date) => date < new Date()} // Disable dates before today
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="policyApproved"
                  name="policyApproved"
                  checked={formData.policyApproved}
                  onCheckedChange={(checked) => setFormData({...formData, policyApproved: checked})}
                  required
                />
                <Label htmlFor="policyApproved">
                  I have read and agree to the <a href={pet.policyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Foster Policy</a>.
                </Label>
              </div>

              {submitError && <p className="text-red-500">Error submitting application: {submitError.message }</p>}
              {submitSuccess && <p className="text-green-500">Application submitted successfully!</p>}

              <Button type="submit" disabled={submitting || !formData.policyApproved || !formData.fromDate || !formData.toDate}>
                {submitting ? 'Submitting...' : 'Apply to Foster'}
              </Button>
            </form>
          </div> {/* Close div for spacing */}
        </DialogContent>
      </Dialog>
        </div>
      </div>
      

    </section>
  );
};

export default PetDetailsAndApply;

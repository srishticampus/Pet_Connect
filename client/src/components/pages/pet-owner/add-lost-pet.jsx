import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import petOwnerService from '@/components/pages/pet-owner/petOwnerService'; // Import petOwnerService
import { useNavigate, useParams } from 'react-router'; // Import useParams

const AddLostPet = () => {
  const navigate = useNavigate();
  const { petId } = useParams(); // Get petId from URL parameters

  // Form state
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [petOneLineDescription, setPetOneLineDescription] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petGender, setPetGender] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petSize, setPetSize] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [petHealthVaccinations, setPetHealthVaccinations] = useState('');
  const [petLostDate, setPetLostDate] = useState('');
  const [petLocation, setPetLocation] = useState('');
  const [petPhoto, setPetPhoto] = useState(null); // State to store the selected file object
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(''); // State to store existing photo URL

  useEffect(() => {
    // If petId exists, fetch pet data and populate the form
    if (petId) {
      const fetchPetData = async () => {
        try {
          const data = await petOwnerService.getLostPetById(petId);
          setPetName(data.name || '');
          setPetSpecies(data.Species || '');
          setPetOneLineDescription(data.shortDescription || '');
          setPetAge(data.Age || '');
          setPetGender(data.Gender || '');
          setPetBreed(data.Breed || '');
          setPetSize(data.Size || '');
          setPetDescription(data.description || '');
          setPetHealthVaccinations(data.healthVaccinations ? data.healthVaccinations.join(', ') : '');
          setPetLostDate(data.lostDate ? new Date(data.lostDate).toISOString().split('T')[0] : ''); // Format date for input
          setPetLocation(data.Location || '');
          setExistingPhotoUrl(data.Photo || ''); // Set existing photo URL
        } catch (error) {
          console.error('Failed to fetch pet data:', error);
          // Handle error (e.g., show an error message, redirect)
          navigate('/pet-owner/find-pet'); // Redirect if pet not found or error
        }
      };
      fetchPetData();
    }
  }, [petId, navigate]); // Depend on petId and navigate

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPetPhoto(event.target.files[0]);
      setExistingPhotoUrl(''); // Clear existing photo URL when a new file is selected
    } else {
      setPetPhoto(null);
    }
  };

  const handleSavePet = async () => {
    const formData = new FormData();
    formData.append('name', petName);
    formData.append('species', petSpecies);
    formData.append('shortDescription', petOneLineDescription);
    formData.append('age', parseInt(petAge, 10));
    formData.append('gender', petGender);
    formData.append('breed', petBreed);
    formData.append('size', petSize);
    formData.append('description', petDescription);
    formData.append('healthVaccinations', petHealthVaccinations);
    formData.append('location', petLocation);
    formData.append('lostDate', petLostDate);
    if (petPhoto) {
      formData.append('photo', petPhoto);
    }

    try {
      if (petId) {
        // Editing existing pet
        await petOwnerService.editLostPet(petId, formData);
      } else {
        // Adding new pet
        await petOwnerService.addLostPet(formData);
      }
      // Navigate back to the find pets page on success
      navigate('/pet-owner/find-pet');
    } catch (error) {
      console.error(`Failed to ${petId ? 'edit' : 'add'} lost pet:`, error);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{petId ? 'Edit Lost Pet' : 'Report a Lost Pet'}</h1>

      {/* Image Upload */}
      <div className="mb-6">
        <Label htmlFor="photo">Pet Photo</Label>
        <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
        {petPhoto && <p className="text-sm mt-2">Selected file: {petPhoto.name}</p>}
        {!petPhoto && existingPhotoUrl && (
          <div className="mt-4">
            <p className="text-sm mb-2">Existing Photo:</p>
            <img src={`${import.meta.env.VITE_API_URL}${existingPhotoUrl}`} alt="Existing Pet" className="w-32 h-32 object-cover rounded-md" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Species */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="species">Species</Label>
          <Input id="species" value={petSpecies} onChange={(e) => setPetSpecies(e.target.value)} />
        </div>

        {/* 1 line Description */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="oneLineDescription">1 line Description</Label>
          <Input id="oneLineDescription" value={petOneLineDescription} onChange={(e) => setPetOneLineDescription(e.target.value)} />
        </div>

        {/* Age */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={petAge} onChange={(e) => setPetAge(e.target.value)} />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
           <Select onValueChange={setPetGender} value={petGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Breed */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" value={petBreed} onChange={(e) => setPetBreed(e.target.value)} />
        </div>

        {/* Size */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="size">Size</Label>
           <Select onValueChange={setPetSize} value={petSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={petDescription} onChange={(e) => setPetDescription(e.target.value)} />
        </div>

        {/* Health & Vaccinations */}
        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
          <Label htmlFor="healthVaccinations">Health & Vaccinations (comma-separated)</Label>
          <Textarea id="healthVaccinations" value={petHealthVaccinations} onChange={(e) => setPetHealthVaccinations(e.target.value)} />
        </div>

        {/* Lost Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="lostDate">Lost Date</Label>
          <Input id="lostDate" type="date" value={petLostDate} onChange={(e) => setPetLostDate(e.target.value)} />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={petLocation} onChange={(e) => setPetLocation(e.target.value)} />
        </div>
      </div>

      {/* Confirm Button */}
      <div className="mt-6">
        <Button onClick={handleSavePet}>{petId ? 'Save Changes' : 'Confirm'}</Button>
      </div>
    </div>
  );
};

export default AddLostPet;
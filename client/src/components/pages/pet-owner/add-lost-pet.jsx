import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import petOwnerService from '@/components/pages/pet-owner/petOwnerService'; // Import petOwnerService
import { useNavigate, useParams } from 'react-router'; // Import useParams
import imagePrev from "@/assets/imageprev.png";
import api from '@/utils/api'; // Import the api service

const Gender = z.enum(['male', 'female', 'other']);
const Size = z.enum(['small', 'medium', 'large']);

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Pet name must be at least 2 characters.",
  }),
  species: z.string().min(2, {
    message: "Species must be at least 2 characters.",
  }),
  shortDescription: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  age: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Age must be a positive number.",
  }),
  gender: Gender,
  breed: z.string().min(2, {
    message: "Breed must be at least 2 characters.",
  }),
  size: Size,
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  healthVaccinations: z.string().optional(),
  lostDate: z.string().refine((dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for comparison
    return selectedDate <= today;
  }, {
    message: "Lost Date cannot be in the future."
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  photo: z.any().optional()
});

const AddLostPet = () => {
  const navigate = useNavigate();
  const { petId } = useParams();

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
  const [existingPhotoUrl, setExistingPhotoUrl] = useState('');
  const [backendError, setBackendError] = useState(''); // State to store backend error messages
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // New state for image preview

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      species: '',
      shortDescription: '',
      age: '',
      gender: 'male',
      breed: '',
      size: 'small',
      description: '',
      healthVaccinations: '',
      lostDate: '',
      location: '',
      photo: null,
    },
  });

  useEffect(() => {
    // If petId exists, fetch pet data and populate the form
    if (petId) {
      const fetchPetData = async () => {
        try {
          const data = await petOwnerService.getLostPetById(petId);
          setValue('name', data.name || '');
          setValue('species', data.Species || '');
          setValue('shortDescription', data.shortDescription || '');
          setValue('age', data.Age || '');
          setValue('gender', data.Gender || '');
          setValue('breed', data.Breed || '');
          setValue('size', data.Size || '');
          setValue('description', data.description || '');
          setValue('healthVaccinations', data.healthVaccinations ? data.healthVaccinations.join(', ') : '');
          setValue('lostDate', data.lostDate ? new Date(data.lostDate).toISOString().split('T')[0] : '');
          setValue('location', data.Location || '');
          setExistingPhotoUrl(data.Photo || '');
        } catch (error) {
          console.error('Failed to fetch pet data:', error);
          // Handle error (e.g., show an error message, redirect)
          navigate('/pet-owner/find-pet'); // Redirect if pet not found or error
        }
      };
      fetchPetData();
    }
  }, [petId, navigate]); // Depend on petId and navigate

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPetPhoto(file);
      setExistingPhotoUrl(''); // Clear existing photo URL when a new file is selected
      setImagePreviewUrl(URL.createObjectURL(file)); // Set image preview

      const mlFormData = new FormData();
      mlFormData.append('image', file);

      try {
        const mlResponse = await api.post('http://localhost:3000/api/ml/predict', mlFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setValue('breed', mlResponse.data.breed);
        setValue('species', mlResponse.data.type); // Assuming 'type' from API maps to 'species'
      } catch (mlError) {
        console.error('Error predicting pet type/breed:', mlError);
        // Optionally, set an error message for the user
      }
    } else {
      setPetPhoto(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSavePet = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('species', data.species);
    formData.append('shortDescription', data.shortDescription);
    formData.append('age', parseInt(data.age, 10));
    formData.append('gender', data.gender);
    formData.append('breed', data.breed);
    formData.append('size', data.size);
    formData.append('description', data.description);
    formData.append('healthVaccinations', data.healthVaccinations);
    formData.append('location', data.location);
    formData.append('lostDate', data.lostDate);
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
      setBackendError(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{petId ? 'Edit Lost Pet' : 'Report a Lost Pet'}</h1>

      {backendError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {backendError}</span>
        </div>
      )}

      {/* Image Upload */}
      <div className="mb-6">
        <Label htmlFor="photo">Pet Photo</Label>
        <img
          src={imagePreviewUrl || imagePrev} // Use imagePreviewUrl or fallback to imagePrev
          alt="Upload"
          style={{ cursor: 'pointer', maxWidth: '500px', display: 'block', margin: '0 auto' }}
          onClick={() => document.getElementById('photoInput').click()}
        />
        <Input
          id="photoInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {petPhoto && <p className="text-sm mt-2">Selected file: {petPhoto.name}</p>}
        {!petPhoto && existingPhotoUrl && (
          <div className="mt-4">
            <p className="text-sm mb-2">Existing Photo:</p>
            <img src={`${import.meta.env.VITE_API_URL}${existingPhotoUrl}`} alt="Existing Pet" className="w-32 h-32 object-cover rounded-md" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pet Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Pet Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          )}
        </div>

        {/* Species */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="species">Species</Label>
          <Input id="species" {...register("species")} />
          {errors.species && (
            <p className="text-red-500 text-sm">{errors.species?.message}</p>
          )}
        </div>

        {/* 1 line Description */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="shortDescription">1 line Description</Label>
          <Input id="shortDescription" {...register("shortDescription")} />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription?.message}</p>
          )}
        </div>

        {/* Age */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" {...register("age")} />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age?.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Select {...register("gender")}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* Breed */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" {...register("breed")} />
          {errors.breed && (
            <p className="text-red-500 text-sm">{errors.breed?.message}</p>
          )}
        </div>

        {/* Size */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="size">Size</Label>
          <Select {...register("size")}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
          {errors.size && (
            <p className="text-red-500 text-sm">{errors.size?.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description?.message}</p>
          )}
        </div>

        {/* Health & Vaccinations */}
        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
          <Label htmlFor="healthVaccinations">
            Health & Vaccinations (comma-separated)
          </Label>
          <Textarea id="healthVaccinations" {...register("healthVaccinations")} />
          {errors.healthVaccinations && (
            <p className="text-red-500 text-sm">
              {errors.healthVaccinations?.message}
            </p>
          )}
        </div>

        {/* Lost Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="lostDate">Lost Date</Label>
          <Input id="lostDate" type="date" {...register("lostDate")} max={new Date().toISOString().split('T')[0]} />
          {errors.lostDate && (
            <p className="text-red-500 text-sm">{errors.lostDate?.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location?.message}</p>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="mt-6">
        <Button onClick={handleSubmit(handleSavePet)}>
          {petId ? 'Save Changes' : 'Confirm'}
        </Button>
      </div>
    </div>
  );
};

export default AddLostPet;

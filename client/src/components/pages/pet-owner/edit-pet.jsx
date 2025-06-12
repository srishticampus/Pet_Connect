import React, { useState, useEffect } from 'react';
import { Skeleton } from '../../ui/skeleton';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router';
import petOwnerService from './petOwnerService'; // Import the petOwnerService
import api from '@/utils/api'; // Import the api service

const EditPet = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { petId } = useParams(); // Get petId from URL
  const [formData, setFormData] = useState({
    image: null, // Keep image as null initially
    name: '',
    species: '',
    shortDescription: '',
    age: '',
    gender: '',
    breed: '',
    size: '',
    description: '',
    health: '',
    origin: 'owner', // Add origin field with default value
  });
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [submitting, setSubmitting] = useState(false); // State for form submission loading
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // New state for image preview

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const petData = await petOwnerService.getPetById(petId); // Fetch pet data
        setFormData({
          image: null, // Don't pre-fill image input
          name: petData.name || '',
          species: petData.Species || '', // Map backend Species to frontend species
          shortDescription: petData.shortDescription || '',
          age: petData.Age || '', // Map backend Age to frontend age
          gender: petData.Gender || '', // Map backend Gender to frontend gender
          breed: petData.Breed || '', // Map backend Breed to frontend breed
          size: petData.Size || '', // Map backend Size to frontend size
          description: petData.description || '',
          health: petData.healthVaccinations ? petData.healthVaccinations.join(', ') : '', // Convert array to comma-separated string
          origin: petData.origin || 'owner',
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching pet data:', err);
      }
    };

    fetchPetData();
  }, [petId]); // Refetch when petId changes

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && name === 'image') {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file));

        const mlFormData = new FormData();
        mlFormData.append('image', file);

        try {
          const mlResponse = await api.post('http://localhost:3000/api/ml/predict', mlFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setFormData(prev => ({
            ...prev,
            breed: mlResponse.data.breed || prev.breed,
            species: mlResponse.data.type || prev.species, // Assuming 'type' from API maps to 'species'
          }));
        } catch (mlError) {
          console.error('Error predicting pet type/breed:', mlError);
          // Optionally, set an error message for the user
        }
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    // Clear validation error for the field when it changes
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear validation error for the field when it changes
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Use submitting state for form submission
    setError(null);
    setValidationErrors({}); // Clear previous validation errors

    // Basic validation
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Pet name is required';
    }
    if (!formData.species.trim()) {
      errors.species = 'Species is required';
    }
    if (!formData.shortDescription.trim()) {
      errors.shortDescription = 'Short description is required';
    }
    if (!formData.age || isNaN(formData.age) || parseInt(formData.age, 10) <= 0) {
        errors.age = 'Valid age is required';
    }
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    if (!formData.breed.trim()) {
      errors.breed = 'Breed is required';
    }
    if (!formData.size) {
      errors.size = 'Size is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Full description is required';
    }
    if (!formData.health.trim()) {
      errors.health = 'Health & Vaccinations information is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitting(false);
      return; // Stop submission if there are errors
    }

    const petData = new FormData();
    petData.append('name', formData.name);
    petData.append('Species', formData.species);
    petData.append('shortDescription', formData.shortDescription);
    petData.append('Age', formData.age);
    petData.append('Gender', formData.gender);
    petData.append('Breed', formData.breed);
    petData.append('Size', formData.size);
    petData.append('description', formData.description);
    const healthVaccinations = formData.health.split(',').map(item => item.trim()).filter(item => item);
    petData.append('healthVaccinations', JSON.stringify(healthVaccinations));
    petData.append('origin', formData.origin);
    if (formData.image) {
      petData.append('image', formData.image);
    }

    try {
      await petOwnerService.updatePet(petId, petData); // Use updatePet function

      // Pet updated successfully
      alert('Pet updated successfully!');
      navigate('/pet-owner/manage-pets'); // Redirect to manage pets page

    } catch (err) {
      setError(err.message);
      console.error('Error updating pet:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <section className="container mx-auto px-4 lg:px-0 py-8">
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </section>
    );
  }

  if (error && !submitting) { // Only show error if not submitting
    return <section className="container mx-auto px-4 lg:px-0 py-8 text-red-500">Error: {error}</section>;
  }


  return (
    <section className="container mx-auto px-4 lg:px-0 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Pet</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Image Input */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Pet Image</Label>
          {imagePreviewUrl && (
            <img src={imagePreviewUrl} alt="Pet Preview" className="w-full h-48 object-cover rounded-md mb-2" />
          )}
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="h-auto file:px-2 file:my-1 px-2 py-1 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e54c00] file:text-white hover:file:bg-[#ED824D]"
            onChange={handleInputChange}
          />
        </div>

        {/* Name */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Pet Name</Label>
          <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} />
          {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
        </div>

        {/* Species */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="species">Species</Label>
          <Input id="species" name="species" type="text" value={formData.species} onChange={handleInputChange} />
          {validationErrors.species && <p className="text-red-500 text-sm">{validationErrors.species}</p>}
        </div>

        {/* One-line Description */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input id="shortDescription" name="shortDescription" type="text" value={formData.shortDescription} onChange={handleInputChange} />
          {validationErrors.shortDescription && <p className="text-red-500 text-sm">{validationErrors.shortDescription}</p>}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
          {validationErrors.age && <p className="text-red-500 text-sm">{validationErrors.age}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-2 w-full">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.gender && <p className="text-red-500 text-sm">{validationErrors.gender}</p>}
        </div>

        {/* Breed */}
        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" name="breed" type="text" value={formData.breed} onChange={handleInputChange} />
          {validationErrors.breed && <p className="text-red-500 text-sm">{validationErrors.breed}</p>}
        </div>

        {/* Size */}
        <div className="space-y-2 w-full">
          <Label htmlFor="size">Size</Label>
          <Select name="size" value={formData.size} onValueChange={(value) => handleSelectChange('size', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.size && <p className="text-red-500 text-sm">{validationErrors.size}</p>}
        </div>

        {/* Descriptions */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" name="description" rows="3" value={formData.description} onChange={handleInputChange} />
          {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
        </div>

        {/* Health & Vaccinations */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="health">Health & Vaccinations (Comma seperated)</Label>
          <Textarea id="health" name="health" rows="3" value={formData.health} onChange={handleInputChange} />
          {validationErrors.health && <p className="text-red-500 text-sm">{validationErrors.health}</p>}
        </div>

        {/* Hidden origin input */}
        <input type="hidden" name="origin" value="owner" />

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="bg-[#e54c00] hover:bg-[#ED824D]" disabled={submitting}>
            {submitting ? 'Updating Pet...' : 'Update Pet'}
          </Button>
        </div>
        {error && submitting && <div className="md:col-span-2 text-red-500">{error}</div>} {/* Only show error during submission */}
      </form>
    </section>
  );
};

export default EditPet;

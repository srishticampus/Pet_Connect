import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getPetById, updatePet } from './rescueShelterService'; // Assuming the service file is in the same directory
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const EditPet = () => {
  const { id } = useParams(); // Get pet ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    shortDescription: '',
    age: '',
    gender: '',
    breed: '',
    size: '',
    description: '',
    healthVaccinations: '', // Changed to string for comma-separated input
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true); // Set initial loading to true for fetching data
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission
  const [generatingDescription, setGeneratingDescription] = useState(false); // New state for AI generation
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const petData = await getPetById(id);
        setFormData({
          name: petData.name || '',
          species: petData.Species || '', // Note capitalization from schema
          shortDescription: petData.shortDescription || '',
          age: petData.Age || '', // Note capitalization from schema
          gender: petData.Gender || '', // Note capitalization from schema
          breed: petData.Breed || '', // Note capitalization from schema
          size: petData.Size || '', // Note capitalization from schema
          description: petData.description || '',
          healthVaccinations: petData.healthVaccinations ? petData.healthVaccinations.join(', ') : '',
        });
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError('Failed to fetch pet details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]); // Refetch when ID changes

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && name === 'image') { // Check for file input with name 'image'
        console.log('Image file selected. File:', files[0]); // Log the file
        setImage(files[0]); // Update the image state
    } else {
        setFormData({
          ...formData,
          [name]: type === 'file' ? files[0] : value // Keep existing logic for other inputs
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


  const handleGenerateDescription = async () => {
    setGeneratingDescription(true);
    setError(null);
    try {
      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        size: formData.size,
        temperament: '', // Assuming temperament is not a direct input, or needs to be added
        medicalHistory: formData.healthVaccinations,
        specialNeeds: '', // Assuming special needs is not a direct input
        behavior: '', // Assuming behavior is not a direct input
        color: '', // Assuming color is not a direct input
        location: '', // Assuming location is not a direct input
        status: 'Available for adoption', // Default status
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/llm/generate-pet-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to generate description');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, description: data.description }));
    } catch (err) {
      setError(err.message);
      console.error('Error generating description:', err);
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
    if (!formData.healthVaccinations.trim()) {
      errors.healthVaccinations = 'Health & Vaccinations information is required';
    }


    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitting(false);
      return; // Stop submission if there are errors
    }


    const petData = new FormData();
    petData.append('name', formData.name);
    petData.append('Species', formData.species); // Note capitalization for backend
    petData.append('shortDescription', formData.shortDescription);
    petData.append('Age', formData.age); // Note capitalization for backend
    petData.append('Gender', formData.gender); // Note capitalization for backend
    petData.append('Breed', formData.breed); // Note capitalization for backend
    petData.append('Size', formData.size); // Note capitalization for backend
    petData.append('description', formData.description);
    const healthVaccinationsArray = formData.healthVaccinations.split(',').map(item => item.trim()).filter(item => item);
    petData.append('healthVaccinations', JSON.stringify(healthVaccinationsArray));
console.log('Image state before appending to FormData:', image); // Log image state
    if (image) {
      petData.append('image', image);
    }

    try {
      const res = await updatePet(id, petData); // Use the updatePet function
console.log('Update pet response:', res); // Log the response

      // Pet updated successfully
      alert('Pet updated successfully!');
      navigate('/rescue-shelter/manage-pets'); // Navigate back to manage pets page

    } catch (err) {
      setError('Failed to update pet. Please try again.');
      console.error('Error updating pet:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 lg:px-0 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Input Skeleton */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Name Skeleton */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Species Skeleton */}
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Short Description Skeleton */}
          <div className="md:col-span-2 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Age Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Gender Skeleton */}
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Breed Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Size Skeleton */}
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Descriptions Skeleton */}
          <div className="md:col-span-2 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>

          {/* Health & Vaccinations Skeleton */}
          <div className="md:col-span-2 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-20 w-full" />
          </div>

          {/* Submit Button Skeleton */}
          <div className="md:col-span-2 flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>
    );
  }

  if (error && !formData.name) { // Show error only if pet data couldn't be fetched
      return <div className="text-red-500">{error}</div>;
  }


  return (
    <section className="container mx-auto px-4 lg:px-0 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Pet</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Image Input */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Pet Image</Label>
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
              <SelectItem value="other">Other</SelectItem>
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
          <Button
            type="button"
            onClick={handleGenerateDescription}
            className="bg-blue-500 hover:bg-blue-600 text-white mt-2"
            disabled={generatingDescription}
          >
            {generatingDescription ? 'Generating...' : 'Generate Description with AI'}
          </Button>
          {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
        </div>

        {/* Health & Vaccinations */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="healthVaccinations">Health & Vaccinations (Comma seperated)</Label>
          <Textarea id="healthVaccinations" name="healthVaccinations" rows="3" value={formData.healthVaccinations} onChange={handleInputChange} />
          {validationErrors.healthVaccinations && <p className="text-red-500 text-sm">{validationErrors.healthVaccinations}</p>}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="bg-[#e54c00] hover:bg-[#ED824D]" disabled={submitting}>
            {submitting ? 'Updating Pet...' : 'Update Pet'}
          </Button>
        </div>
        {error && <div className="md:col-span-2 text-red-500">{error}</div>}
      </form>
    </section>
  );
};

export default EditPet;

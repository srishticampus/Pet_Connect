import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router';
import api from '@/utils/api'; // Import the api service
import imagePrev from "@/assets/imageprev.png";
const AddPet = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    image: null,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // New state for image preview

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

  const handleSubmit = async (e) => { // Made function async
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
      return; // Stop submission if there are errors
    }

    const petData = new FormData();
    petData.append('name', formData.name);
    petData.append('species', formData.species);
    petData.append('shortDescription', formData.shortDescription);
    petData.append('age', formData.age);
    petData.append('gender', formData.gender);
    petData.append('breed', formData.breed);
    petData.append('size', formData.size);
    petData.append('description', formData.description);
    const healthVaccinations = formData.health.split(',').map(item => item.trim()).filter(item => item);
    petData.append('healthVaccinations', JSON.stringify(healthVaccinations));
    petData.append('origin', formData.origin);
    if (formData.image) {
      petData.append('image', formData.image);
    }

    try {
      await api.post('/pets/upload', petData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Use api.post with correct endpoint

      // Pet added successfully
      alert('Pet added successfully!');
      navigate('/pet-owner/manage-pets'); // Redirect to manage pets page

    } catch (err) {
      setError(err.message);
      console.error('Error adding pet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 lg:px-0 py-8">
      <h1 className="text-2xl font-semibold mb-6">Add New Pet</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto" onSubmit={handleSubmit}>
        {/* Image Input */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Pet Image</Label>
          <img
            src={imagePrev}
             alt="Upload"
             style={{ cursor: 'pointer', maxWidth: '500px', display: 'block', margin: '0 auto' }}
             onClick={() => document.getElementById('imageInput').click()}
          />
          <Input
            id="imageInput"
            name="image"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
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
          <Button type="submit" className="bg-[#e54c00] hover:bg-[#ED824D]" disabled={loading}>
            {loading ? 'Adding Pet...' : 'Add Pet'}
          </Button>
        </div>
        {error && <div className="md:col-span-2 text-red-500">{error}</div>}
      </form>
    </section>
  );
};

export default AddPet;

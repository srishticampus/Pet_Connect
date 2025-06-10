import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router';
import { addPet } from './rescueShelterService'; // Assuming the service file is in the same directory

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
    healthVaccinations: '', // Changed to string for comma-separated input
  });
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false); // New state for AI generation
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
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
    if (!formData.healthVaccinations.trim()) {
      errors.healthVaccinations = 'Health & Vaccinations information is required';
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
    const healthVaccinationsArray = formData.healthVaccinations.split(',').map(item => item.trim()).filter(item => item);
    petData.append('healthVaccinations', JSON.stringify(healthVaccinationsArray));
    if (formData.image) {
      petData.append('image', formData.image);
    }

    try {
      await addPet(petData); // Use the addPet function from rescueShelterService

      // Pet added successfully
      alert('Pet added successfully!');
      navigate('/rescue-shelter/manage-pets'); // Assuming a route for managing pets

    } catch (err) {
      setError(err.message);
      console.error('Error adding pet:', err);
    } finally {
      setLoading(false);
    }
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

  return (
    <section className="container mx-auto px-4 lg:px-0 py-8">
      <h1 className="text-2xl font-semibold mb-6">Add New Pet for Adoption/Foster</h1>
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
              <SelectItem value="other">Other</SelectItem> {/* Added 'other' gender option */}
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

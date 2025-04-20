import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const AddPet = () => {
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
    health: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const petData = {
      id: 1, // Static for now
      image: '/client/src/assets/cardimg-1.png', // Using a sample image from the project as requested
      name: formData.name,
      age: formData.age ? `${formData.age} years` : '', // Format age
      gender: formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : '', // Capitalize gender
      breed: formData.breed,
      size: formData.size ? formData.size.charAt(0).toUpperCase() + formData.size.slice(1) : '', // Capitalize size
      description: formData.description,
      healthVaccinations: formData.health ? formData.health.split(',').map(item => item.trim()).filter(item => item) : [] // Split health by comma into array
    };

    console.log('Formatted pet data:', petData);
    // Here you would typically send petData to an API
  };

  return (
    <section className="container mx-auto px-4 lg:px-0 py-8">
      <h1 className="text-2xl font-semibold mb-6">Add New Pet</h1>
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
        </div>

        {/* Species */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="species">Species</Label>
          <Input id="species" name="species" type="text" value={formData.species} onChange={handleInputChange} />
        </div>

        {/* One-line Description */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input id="shortDescription" name="shortDescription" type="text" value={formData.shortDescription} onChange={handleInputChange} />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
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
        </div>

        {/* Breed */}
        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" name="breed" type="text" value={formData.breed} onChange={handleInputChange} />
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
        </div>

        {/* Descriptions */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" name="description" rows="3" value={formData.description} onChange={handleInputChange} />
        </div>

        {/* Health & Vaccinations */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="health">Health & Vaccinations (Comma seperated)</Label>
          <Textarea id="health" name="health" rows="3" value={formData.health} onChange={handleInputChange} />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="bg-[#e54c00] hover:bg-[#ED824D]">
            Add Pet
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddPet;
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "@/assets/profile-pic.png";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from 'react-router';
import api from "@/utils/api";

export default function PetOwnerSignUp() {
  const [formData, setFormData] = useState({
    profilePic: null,
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    aadhaarImage: null,
    aadhaarNumber: '',
    newPassword: '',
    confirmPassword: '',
    role: "pet_owner"
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);
  const [aadhaarImagePreview, setAadhaarImagePreview] = useState(null);
  const { error: authError, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file });
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAadhaarImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, aadhaarImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setAadhaarImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Create user first
        const userData = { ...formData };
        delete userData.profilePic;
        delete userData.aadhaarImage;
        delete userData.confirmPassword;

        const userResponse = await api.post('/auth/register/pet-owner', userData);
        
        // Then upload images
        if (formData.profilePic || formData.aadhaarImage) {
          const imageData = new FormData();
          if (formData.profilePic) imageData.append('profilePic', formData.profilePic);
          if (formData.aadhaarImage) imageData.append('aadhaarImage', formData.aadhaarImage);

          await api.post(
            `/auth/register/pet-owner/${userResponse.data.userId}/images`,
            imageData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        }

        navigate("/login");
      } catch (err) {
        console.error("Registration failed", err);
      }
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) errors.name = 'Name is required';
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!data.address) errors.address = 'Address is required';
    if (!data.aadhaarImage) errors.aadhaarImage = "Aadhaar image is required";
    if (!data.aadhaarNumber) errors.aadhaarNumber = 'Aadhaar number is required';
    if (!data.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (data.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  return (
    <main className="container mx-3 flex flex-col items-center gap-4 my-16">
      <h1 className="text-center text-primary text-3xl">Sign Up!</h1>
      <label className="flex flex-col items-center justify-center">
        <img src={profilePicPreview} alt="upload profile pic" className="w-48 h-56 object-contain rounded-full" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
      </label>
      
      {authError && <div className="text-red-500 text-sm">{authError}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
        <label className="flex flex-col">
          <span>Name</span>
          <Input name="name" value={formData.name} onChange={handleChange} disabled={isLoading} />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </label>

        <label className="flex flex-col">
          <span>Email</span>
          <Input name="email" value={formData.email} onChange={handleChange} disabled={isLoading} />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </label>

        <label className="flex flex-col">
          <span>Phone Number</span>
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={isLoading} />
          {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
        </label>

        <label className="flex flex-col">
          <span>Address</span>
          <Input name="address" value={formData.address} onChange={handleChange} disabled={isLoading} />
          {errors.address && <span className="text-red-500">{errors.address}</span>}
        </label>

        <label className="flex flex-col">
          <span>Aadhaar Image</span>
          <Input 
            type="file" 
            accept="image/*, application/pdf" 
            name="aadhaarImage" 
            onChange={handleAadhaarImageChange} 
            disabled={isLoading} 
          />
          {errors.aadhaarImage && <span className="text-red-500">{errors.aadhaarImage}</span>}
        </label>

        <label className="flex flex-col">
          <span>Aadhaar Number</span>
          <Input 
            name="aadhaarNumber" 
            value={formData.aadhaarNumber} 
            onChange={handleChange} 
            disabled={isLoading} 
          />
          {errors.aadhaarNumber && <span className="text-red-500">{errors.aadhaarNumber}</span>}
        </label>

        <label className="flex flex-col">
          <span>New Password</span>
          <Input 
            type="password" 
            name="newPassword" 
            value={formData.newPassword} 
            onChange={handleChange} 
            disabled={isLoading} 
          />
          {errors.newPassword && <span className="text-red-500">{errors.newPassword}</span>}
        </label>

        <label className="flex flex-col">
          <span>Confirm Password</span>
          <Input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            disabled={isLoading} 
          />
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
        </label>

        <Button type="submit" className="sm:col-span-2" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
      <p>Already have an account? <a href="/login" className="underline">Login</a></p>
    </main>
  );
}

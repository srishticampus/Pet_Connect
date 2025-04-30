import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from '@/components/ui/alert';
import profilepic from "@/assets/profile-pic.png";

const RescueShelterSignUp = () => {
  const [formData, setFormData] = useState({
    profilePic: null,
    name: '',
    email: '',
    username: '',
    newPassword: '',
    phoneNumber: '',
    address: '',
    certificate: null,
    confirmPassword: '',
    role: "rescue-shelter"
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const { register, error: authError, clearError, isLoading,isAuthenticated } = useAuth();
  const navigate = useNavigate();
    // Redirect if already authenticated
    useEffect(() => {
      if (isAuthenticated) {
        navigate("/logout-prompt");
      }
    }, [isAuthenticated, navigate]);

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

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, certificate: file });
      const reader = new FileReader();
      reader.onloadend = () => setCertificatePreview(reader.result);
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
        const userData = { ...formData };
        delete userData.profilePic;
        delete userData.certificate;
        delete userData.confirmPassword;

        const imageData = new FormData();
        if (formData.profilePic) imageData.append('profilePic', formData.profilePic);
        if (formData.certificate) imageData.append('certificate', formData.certificate);

        await register('rescue-shelter', userData, imageData);
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
    if (!data.address) errors.address = 'Place is required';
    // Certificate is not required, so no validation here
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
    <main className="container mx-3 md:mx-auto flex flex-col items-center gap-4 my-16">
      <h1 className="text-center text-primary text-3xl">Sign Up!</h1>
      <label className="flex flex-col items-center justify-center">
        <img src={profilePicPreview} alt="upload profile pic" className="w-48 h-56 object-contain rounded-full" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
      </label>

      {authError && <div className="text-red-500 text-sm">{authError}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
        <label className="flex flex-col">
          <span>Name</span>
          <Input name="name" value={formData.name} onChange={handleChange} disabled={isLoading} autocomplete="name" />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </label>

        <label className="flex flex-col">
          <span>Email</span>
          <Input name="email" value={formData.email} onChange={handleChange} disabled={isLoading} autocomplete="email" />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </label>

        <label className="flex flex-col">
          <span>Phone Number</span>
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={isLoading} autocomplete="tel" />
          {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
        </label>

        <label className="flex flex-col">
          <span>Address</span>
          <Input name="address" value={formData.address} onChange={handleChange} disabled={isLoading} autocomplete="street-address" />
          {errors.address && <span className="text-red-500">{errors.address}</span>}
        </label>

        <label className="flex flex-col">
          <span>Certificate (Optional)</span>
          <Input
            type="file"
            accept="image/*, application/pdf"
            name="certificate"
            onChange={handleCertificateChange}
            disabled={isLoading}
          />
          {errors.certificate && <span className="text-red-500">{errors.certificate}</span>}
        </label>

        <label className="flex flex-col">
          <span>Password</span>
          <Input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={isLoading}
            autocomplete="new-password"
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
            autocomplete="new-password"
          />
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
        </label>

        <Button type="submit" className="sm:col-span-2" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
      <p>Already have an account? <Link to="/login" className="underline">Login</Link></p>
    </main>
  );
};

export default RescueShelterSignUp;
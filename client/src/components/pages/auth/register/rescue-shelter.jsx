import React, { useState } from 'react';
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

const RescueShelterSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const userData = {
      name,
      email,
      username,
      newPassword,
      phoneNumber,
      address,
    };

    const imageData = new FormData();
    if (profilePic) imageData.append('profilePic', profilePic);
    if (aadhaarImage) imageData.append('aadhaarImage', aadhaarImage);

    try {
      await register('rescue-shelter', userData, imageData);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilePicChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const handleAadhaarImageChange = (event) => {
    setAadhaarImage(event.target.files[0]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Rescue/Shelter Sign Up</CardTitle>
          <CardDescription>Enter your details to register as a rescue/shelter.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="destructive">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="newPassword">Password</Label>
              <Input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="profilePic">Profile Picture</Label>
              <Input type="file" id="profilePic" accept="image/*" onChange={handleProfilePicChange} />
            </div>
            <div>
              <Label htmlFor="aadhaarImage">Aadhaar Image</Label>
              <Input type="file" id="aadhaarImage" accept="image/*" onChange={handleAadhaarImageChange} />
            </div>
            <CardFooter>
              <Button type="submit">Register as Rescue/Shelter</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RescueShelterSignUp;
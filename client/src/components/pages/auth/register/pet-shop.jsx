
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "@/assets/profile-pic.png";
import { Input } from "@/components/ui/input";

export default function PetShopSignUp() {
  const [formData, setFormData] = useState({
    name: '',
    registrationId: '',
    shopName: '',
    location: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
    profilePic: null,
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, profilePic: file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data
      console.log('Form data submitted:', formData);
      // Add your submission logic here (e.g., API call)
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.name) {
      errors.name = 'Name is required';
    }
    if (!data.registrationId) {
      errors.registrationId = 'Registration ID is required';
    }
    if (!data.shopName) {
      errors.shopName = 'Shop Name is required';
    }
    if (!data.location) {
      errors.location = 'Location is required';
    }
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.phone) {
        errors.phone = 'Phone number is required';
    }
    if (!data.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (data.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters long";
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
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className='hidden' />
        </label>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
            <label htmlFor="name" className="flex flex-col">
                <span>Name</span>
                <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
            </label>
            <label htmlFor="registrationId" className="flex flex-col">
                <span>Registration ID</span>
                <Input type="text" name="registrationId" id="registrationId" value={formData.registrationId} onChange={handleChange} />
                {errors.registrationId && <span className="text-red-500">{errors.registrationId}</span>}
            </label>
            <label htmlFor="shopName" className="flex flex-col">
                <span>Shop Name</span>
                <Input type="text" name="shopName" id="shopName" value={formData.shopName} onChange={handleChange} />
                {errors.shopName && <span className="text-red-500">{errors.shopName}</span>}
            </label>
            <label htmlFor="location" className="flex flex-col">
                <span>Location</span>
                <Input type="text" name="location" id="location" value={formData.location} onChange={handleChange} />
                {errors.location && <span className="text-red-500">{errors.location}</span>}
            </label>
            <label htmlFor="email" className="flex flex-col">
                <span>Email</span>
                <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
            </label>
            <label htmlFor="phone" className="flex flex-col">
                <span>Phone Number</span>
                <Input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
            </label>
            <label htmlFor="newPassword" className="flex flex-col">
                <span>New Password</span>
                <Input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} />
                {errors.newPassword && <span className="text-red-500">{errors.newPassword}</span>}
            </label>
            <label htmlFor="confirmPassword" className="flex flex-col">
                <span>Confirm Password</span>
                <Input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
            </label>

            <Button type="submit" className="sm:col-span-2">Sign Up</Button>
        </form>
        <p>Already have an account? <a href="/login" className="underline">Login</a></p>
    </main>
  );
}

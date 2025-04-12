import { useState } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "@/assets/profile-pic.png";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth"; // Import useAuth
import { useNavigate } from 'react-router'; // Import useNavigate
import api from "@/utils/api"; // Import api

export default function PetOwnerSignUp() {
  const [formData, setFormData] = useState({
    profilePic: null,
    name: '',
    email: '',
    phone: '',
    place: '',
    aadhaarImage: null,
    aadhaarNumber: '',
    newPassword: '',
    confirmPassword: '',
    role: "pet_owner" // Corrected role value
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);
  const [_aadhaarImagePreview, setAadhaarImagePreview] = useState(null);
  const { register, error: authError, clearError, isLoading } = useAuth(); // Get register function, error, clearError, and isLoading from context
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
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadhaarImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, aadhaarImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadhaarImagePreview(reader.result);
      };
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
        await register(formData); // Call the register function from the context
        console.log('Registration successful');
        navigate("/login"); // Redirect to login after successful registration
      } catch (err) {
        // Error is already handled by the AuthProvider and available in the context
        // No need to set error state here
        console.error("Registration failed", err);
      }
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.name) {
      errors.name = 'Name is required';
    }
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.phone) {
      errors.phone = 'Phone number is required';
    }
    if (!data.place) {
      errors.place = 'Place is required';
    }
    if (!data.aadhaarImage) {
      errors.aadhaarImage = "Aadhaar image should be uploaded."
    }

    if (!data.aadhaarNumber) {
      errors.aadhaarNumber = 'Aadhaar Number is required';
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
      {authError && <div className="text-red-500 text-sm">{authError}</div>} {/* Display registration error */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
        <label htmlFor="name" className="flex flex-col">
          <span>Name</span>
          <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} disabled={isLoading} />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </label>
        <label htmlFor="email" className="flex flex-col">
          <span>Email</span>
          <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} disabled={isLoading} />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </label>
        <label htmlFor="phone" className="flex flex-col">
          <span>Phone Number</span>
          <Input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} disabled={isLoading} />
          {errors.phone && <span className="text-red-500">{errors.phone}</span>}
        </label>
        <label htmlFor="place" className="flex flex-col">
          <span>Place</span>
          <Input type="text" name="place" id="place" value={formData.place} onChange={handleChange} disabled={isLoading} />
          {errors.place && <span className="text-red-500">{errors.place}</span>}
        </label>
        <label htmlFor="aadhaarImage" className="flex flex-col">
          <span>Aadhaar Image</span>
          <Input type="file" accept="image/*, application/pdf" name="aadhaarImage" id="aadhaarImage" onChange={handleAadhaarImageChange} disabled={isLoading} />
          {/* Optional: Display a preview of the Aadhaar image */}
          {/* {aadhaarImagePreview && (
            <img src={aadhaarImagePreview} alt="Aadhaar Preview" style={{ maxWidth: '100px', marginTop: '5px' }} />
          )} */}
          {errors.aadhaarImage && <span className="text-red-500">{errors.aadhaarImage}</span>}
        </label>
        <label htmlFor="aadhaarNumber" className="flex flex-col">
          <span>Aadhaar Number</span>
          <Input type="text" name="aadhaarNumber" id="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} disabled={isLoading} />
          {errors.aadhaarNumber && <span className="text-red-500">{errors.aadhaarNumber}</span>}
        </label>
        <label htmlFor="newPassword" className="flex flex-col">
          <span>New Password</span>
          <Input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} disabled={isLoading} />
          {errors.newPassword && <span className="text-red-500">{errors.newPassword}</span>}
        </label>
        <label htmlFor="confirmPassword" className="flex flex-col">
          <span>Confirm Password</span>
          <Input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
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

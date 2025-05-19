import { useState,useEffect } from 'react';
import { Button } from "@/components/ui/button";
import profilepic from "@/assets/profile-pic.png";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth"; // Import useAuth
import { useNavigate } from 'react-router'; // Import useNavigate

export default function VolunteerSignUp() {
  const [formData, setFormData] = useState({
    profilePic: null,
    name: '',
    username: '',
    email: '',
    newPassword: '',
    phone: '',
    address: '',
    confirmPassword: '',
    role: "volunteer" // Corrected role value
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(profilepic);
  const { register, error: authError, clearError, isLoading,isAuthenticated } = useAuth(); // Get register function, error, clearError, and isLoading from context
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
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
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
        const data = { ...formData };
        delete data.profilePic;
        delete data.confirmPassword;

        const imageData = new FormData();
        if (formData.profilePic) {
          imageData.append('profilePic', formData.profilePic);
        }

        await register('volunteer', data, imageData);
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
    if (!data.username) {
      errors.username = 'Username is required';
    }
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.phone) {
      errors.phone = 'Phone number is required';
    }
     if (!data.address) {
      errors.address = 'Address is required';
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
          <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} disabled={isLoading} autocomplete="name" />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </label>
        <label htmlFor="username" className="flex flex-col">
          <span>Username</span>
          <Input type="text" name="username" id="username" value={formData.username} onChange={handleChange} disabled={isLoading} autocomplete="username" />
          {errors.username && <span className="text-red-500">{errors.username}</span>}
        </label>
        <label htmlFor="email" className="flex flex-col">
          <span>Email</span>
          <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} disabled={isLoading} autocomplete="email" />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </label>
        <label htmlFor="phone" className="flex flex-col">
          <span>Phone Number</span>
          <Input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} disabled={isLoading} autocomplete="tel" />
          {errors.phone && <span className="text-red-500">{errors.phone}</span>}
        </label>
         <label htmlFor="address" className="flex flex-col">
          <span>Address</span>
          <Input type="text" name="address" id="address" value={formData.address} onChange={handleChange} disabled={isLoading} autocomplete="street-address" />
          {errors.address && <span className="text-red-500">{errors.address}</span>}
        </label>
        <label htmlFor="newPassword" className="flex flex-col">
          <span>New Password</span>
          <Input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} disabled={isLoading} autocomplete="new-password" />
          {errors.newPassword && <span className="text-red-500">{errors.newPassword}</span>}
        </label>
        <label htmlFor="confirmPassword" className="flex flex-col">
          <span>Confirm Password</span>
          <Input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} autocomplete="new-password" />
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
        </label>
        <Button type="submit" className="sm:col-span-2" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
      <p>Already have an account? <Link to="/login" className="underline">Login</Link></p>
    </main>
  );
}

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import pfp from "@/assets/pfp.jpeg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LucideLogOut, Camera } from "lucide-react" // Import Camera icon
import { Separator } from '@/components/ui/separator';
import api from '@/utils/api'; // Import the api instance
import { useNavigate } from 'react-router'; // Import useNavigate
import { useAuth } from '@/hooks/auth'; // Import useAuth
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const PetOwnerProfile = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return (
      <div className="w-full">
        <div className="bg-primary h-44 relative"></div>
        <div className="bg-white p-4 relative -mt-16">
          <div className="flex flex-col items-center">
            <h2 className="text-xl text-primary font-semibold mt-2">Admin Profile Not Accessible</h2>
            <p className="mt-2">Admins do not have access to their profile page.</p>
          </div>
        </div>
      </div>
    );
  }

  const [profile, setProfile] = useState({
      name: '',
      phoneNumber: '',
      email: '',
      address: '',
      aadhaarNumber: '',
      aadhaarImage: '',
      role: '',
      lastLogin: '',
      certificate: '', // Add certificate to state
      profilePic: '', // Use profilePic to match backend schema
    });
    const [editFormData, setEditFormData] = useState({}); // State for dialog form data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false); // State for logout dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
    const [selectedProfilePic, setSelectedProfilePic] = useState(null); // State for selected profile picture file
    const [profilePicPreview, setProfilePicPreview] = useState(''); // State for profile picture preview URL
    const [emailError, setEmailError] = useState(''); // State for email validation error
    const navigate = useNavigate(); // Initialize useNavigate
    const { logout } = useAuth(); // Get the logout function from useAuth
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await api.get('/profile');
          setProfile(res.data);
          setProfilePicPreview(res.data.profilePic ? `${import.meta.env.VITE_API_URL}${res.data.profilePic}` : pfp); // Use profilePic from response with server URL, or default
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch profile data.');
          setLoading(false);
        }
      };
  
      fetchProfile();
    }, []); // Empty dependency array means this effect runs once on mount
  
    const handleEditClick = () => {
      setEditFormData(profile); // Populate dialog form with current profile data
      setEmailError(''); // Clear any previous email errors when opening the dialog
      setIsEditDialogOpen(true); // Open the edit dialog
    };
  
    const handleSaveClick = async () => {
      if (emailError) { // Prevent saving if there's a client-side email error
        return;
      }
      try {
        // Assuming a PUT or PATCH endpoint for profile updates
        const res = await api.put('/profile', editFormData); // Send updated data to backend
        setProfile(res.data); // Update profile state with saved data (backend returns profilePic in the response for the upload endpoint)
        setIsEditDialogOpen(false); // Close the dialog
      } catch (err) {
        console.error('Failed to save profile:', err);
        // Handle save error (e.g., display error message)
        if (err.response && err.response.data && err.response.data.msg) {
          setError(err.response.data.msg); // Display server-side error message
        } else {
          setError('Failed to save profile.');
        }
      }
    };
  
    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          setEmailError('Please enter a valid email address.');
        } else {
          setEmailError('');
        }
      }
      setEditFormData({ ...editFormData, [name]: value });
    };

    const handleProfilePictureChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedProfilePic(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleProfilePictureUpload = async () => {
      if (!selectedProfilePic) return;

      const formData = new FormData();
      formData.append('profilePic', selectedProfilePic);

      try {
        // Assuming a PUT or PATCH endpoint for profile picture updates
        const res = await api.put('/profile/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProfile(prevProfile => ({ ...prevProfile, profilePic: res.data.profilePic })); // Update profile state with new picture URL (backend returns profilePic in the response for the upload endpoint)
        setSelectedProfilePic(null); // Clear selected file
        // Optionally show a success message
      } catch (err) {
        console.error('Failed to upload profile picture:', err);
        // Handle upload error
      }
    };


    const handleLogout = async () => {
      try {
        await api.post('/auth/logout'); // Call the logout API endpoint
        localStorage.removeItem('token'); // Remove the token from local storage
        logout(); // Call the logout function from the auth hook
        navigate('/login'); // Redirect to the login page
      } catch (err) {
        console.error('Logout failed:', err);
        setError('Failed to logout.');
      } finally {
        setIsLogoutDialogOpen(false); // Close the dialog after logout attempt
      }
    };
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    if (loading) {
      return (
        <div className="w-full">
          {/* Orange Banner Skeleton */}
          <Skeleton className="bg-primary h-44 relative w-full" />
  
          {/* White Body Skeleton */}
          <div className="bg-white p-4 relative -mt-16">
            {/* Profile Picture Skeleton */}
            <div className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full -mt-20" />
              <Skeleton className="h-6 w-1/3 mt-2" />
              <Skeleton className="h-8 w-1/4 mt-2" />
            </div>
  
            {/* Profile Details Skeleton */}
            <div className="mt-4">
              <Card className="w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="w-full">
        {/* Orange Banner */}
        <div className="bg-primary h-44 relative">
          <div className="absolute top-2 right-2">
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="">
                  <LucideLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Logout</DialogTitle>
                  <Separator />
                  <DialogDescription>
                    Are you sure you want to log out ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" onClick={() => setIsLogoutDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleLogout} className="ml-2" variant="destructive">
                    Log out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
  
        {/* White Body */}
        <div className="bg-white p-4 relative -mt-16">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md relative -mt-20 group"> {/* Added group class */}
              <img
                src={profilePicPreview ? profilePicPreview : (profile.profilePic ? `${import.meta.env.VITE_API_URL}${profile.profilePic}` : pfp)} // Use preview if available, otherwise uploaded pic with server URL, or default
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profilePictureInput"
                onChange={handleProfilePictureChange}
              />
              <label
                htmlFor="profilePictureInput"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                <Camera className="h-6 w-6 text-white" /> {/* Camera icon */}
              </label>
            </div>
            <h2 className="text-xl text-primary  font-semibold mt-2">{profile.name}</h2>
            {selectedProfilePic && ( // Show upload button if a new picture is selected
              <Button onClick={handleProfilePictureUpload} className="mt-2">Upload Picture</Button>
            )}
          </div>
  
          {/* Profile Details */}
          <div className="mt-4">
            <Card className="w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none">Phone Number</p>
                      <p className="text-gray-700">{profile.phoneNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none">Email ID</p>
                      <p className="text-gray-700">{profile.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none">{profile.role === 'rescue-shelter' ? 'Place' : 'Address'}</p>
                      <p className="text-gray-700">{profile.address}</p>
                    </div>
                    {profile.role === 'adopter' || profile.role === 'foster' ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium leading-none">Aadhaar Number</p>
                        <p className="text-gray-700">{profile.aadhaarNumber}</p>
                      </div>
                    ) : null}
                  </div>
  
                  <div className="grid grid-cols-2 gap-4 mt-4"> {/* Added a new grid for additional fields */}
                    {profile.role === 'adopter' || profile.role === 'foster' ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium leading-none">Aadhaar Image</p>
                        {profile.aadhaarImage ? (
                          <Button variant="link" asChild className="text-primary mx-0"><a href={`${import.meta.env.VITE_API_URL}${profile.aadhaarImage}`} target="_blank" rel="noopener noreferrer">View Image</a></Button>
                        ) : (
                          <p className="text-gray-700">Not provided</p>
                        )}
                      </div>
                    ) : null}
  
                    {profile.role === 'rescue-shelter' && profile.certificate ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium leading-none">Certificate</p>
                        <Button variant="link" asChild className="text-primary mx-0"><a href={`${import.meta.env.VITE_API_URL}${profile.certificate}`} target="_blank" rel="noopener noreferrer">View Certificate</a></Button>
                      </div>
                    ) : null}
  
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none">Last Login</p>
                      <p className="text-gray-700">{profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'N/A'}</p> {/* Format date */}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="px-8" onClick={handleEditClick}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <Separator />
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-left">
                              Name
                            </Label>
                            <Input id="name" name="name" value={editFormData.name || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-left">
                              Phone Number
                            </Label>
                            <Input id="phoneNumber" name="phoneNumber" value={editFormData.phoneNumber || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-left">
                              Email
                            </Label>
                            <Input id="email" name="email" value={editFormData.email || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          {emailError && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <div className="col-span-1"></div> {/* Empty div for alignment */}
                              <p className="text-red-500 text-sm col-span-3">{emailError}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-left">
                              {profile.role === 'rescue-shelter' ? 'Place' : 'Address'}
                            </Label>
                            <Input id="address" name="address" value={editFormData.address || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          {profile.role === 'adopter' || profile.role === 'foster' ? (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="aadhaarNumber" className="text-left">
                                Aadhaar Number
                              </Label>
                              <Input id="aadhaarNumber" name="aadhaarNumber" value={editFormData.aadhaarNumber || ''} onChange={handleEditInputChange} className="col-span-3" />
                            </div>
                          ) : null}
                          {/* Add input for certificate if needed and role is rescue-shelter */}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button type="button" onClick={handleSaveClick}>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
  
              </CardContent>
            </Card>


        </div>
      </div>
    </div>
  );
};

export default PetOwnerProfile;

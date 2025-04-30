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

const PetOwnerProfile = () => {
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
    const navigate = useNavigate(); // Initialize useNavigate
    const { logout } = useAuth(); // Get the logout function from useAuth
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await api.get('/profile');
          setProfile(res.data);
          setProfilePicPreview(res.data.profilePic || pfp); // Use profilePic from response
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
      setIsEditDialogOpen(true); // Open the edit dialog
    };
  
    const handleSaveClick = async () => {
      try {
        // Assuming a PUT or PATCH endpoint for profile updates
        const res = await api.put('/profile', editFormData); // Send updated data to backend
        setProfile(res.data); // Update profile state with saved data
        setIsEditDialogOpen(false); // Close the dialog
      } catch (err) {
        console.error('Failed to save profile:', err);
        // Handle save error (e.g., display error message)
      }
    };
  
    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
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
        setProfile(prevProfile => ({ ...prevProfile, profilePic: res.data.profilePic })); // Update profile state with new picture URL
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
  
    if (loading) {
      return <div>Loading profile...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
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
                src={profile.profilePic || pfp} // Use profile.profilePic directly
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
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input id="name" name="name" value={editFormData.name || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                              Phone Number
                            </Label>
                            <Input id="phoneNumber" name="phoneNumber" value={editFormData.phoneNumber || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input id="email" name="email" value={editFormData.email || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                              {profile.role === 'rescue-shelter' ? 'Place' : 'Address'}
                            </Label>
                            <Input id="address" name="address" value={editFormData.address || ''} onChange={handleEditInputChange} className="col-span-3" />
                          </div>
                          {profile.role === 'adopter' || profile.role === 'foster' ? (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="aadhaarNumber" className="text-right">
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

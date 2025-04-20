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
import { LucideLogOut } from "lucide-react"
import { Separator } from '@/components/ui/separator';
import api from '@/utils/api'; // Import the api instance

const PetOwnerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    aadhaarNumber: '',
    role: '',
    lastLogin: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
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
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };


  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    setOpen(false); // Close the dialog after logout attempt
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
          <Dialog open={open} onOpenChange={setOpen}>
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
                <Button type="button" onClick={() => setOpen(false)}>
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
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-md relative -mt-20">
            <img
              src={pfp} // Replace with user's profile image
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl text-primary  font-semibold mt-2">{profile.name}</h2>
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
                    {isEditing ? (
                      <Input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleInputChange} />
                    ) : (
                      <p className="text-gray-700">{profile.phoneNumber}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium leading-none">Email ID</p>
                    {isEditing ? (
                      <Input type="email" name="email" value={profile.email} onChange={handleInputChange} />
                    ) : (
                      <p className="text-gray-700">{profile.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium leading-none">Address</p>
                    {isEditing ? (
                      <Input type="text" name="address" value={profile.address} onChange={handleInputChange} />
                    ) : (
                      <p className="text-gray-700">{profile.address}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium leading-none">Aadhaar Number</p>
                    {isEditing ? (
                      <Input type="text" name="aadhaarNumber" value={profile.aadhaarNumber} onChange={handleInputChange} />
                    ) : (
                      <p className="text-gray-700">{profile.aadhaarNumber}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4"> {/* Added a new grid for additional fields */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium leading-none">Role</p>
                    <p className="text-gray-700">{profile.role}</p> {/* Role is not editable */}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium leading-none">Last Login</p>
                    <p className="text-gray-700">{profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'N/A'}</p> {/* Format date */}
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  {isEditing ? (
                    <Button className="px-8" onClick={handleSaveClick}>Save</Button>
                  ) : (
                    <Button className="px-8" onClick={handleEditClick}>Edit</Button>
                  )}
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

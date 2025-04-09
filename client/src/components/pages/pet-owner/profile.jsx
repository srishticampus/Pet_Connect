import { useState } from 'react';
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

const PetOwnerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    place: 'New York',
    aadhaar: '1234-5678-9012',
    aadhaarImage: 'link ', // Replace with actual image link
  });
  const [open, setOpen] = useState(false)

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

  const handleAadhaarImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Assuming you have a way to store/handle the file, e.g., upload to a server and get a link.
      // For now, just store the file name as a placeholder.
      setProfile({ ...profile, aadhaarImage: file.name });
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    setOpen(false); // Close the dialog after logout attempt
  };


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
                <Separator/>
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
                    <Input type="text" name="phone" value={profile.phone} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-700">{profile.phone}</p>
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
                  <p className="text-sm font-medium leading-none">Place</p>
                  {isEditing ? (
                    <Input type="text" name="place" value={profile.place} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-700">{profile.place}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Aadhaar Number</p>
                  {isEditing ? (
                    <Input type="text" name="aadhaar" value={profile.aadhaar} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-700">{profile.aadhaar}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Aadhaar Image</p>
                  {isEditing ? (
                    <Input type="file" accept=".pdf" onChange={handleAadhaarImageChange} />
                  ) : (
                    <a href={profile.aadhaarImage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profile.aadhaarImage}</a>
                  )}
                </div>
                </div>
                <div className="mt-4  flex justify-center">
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

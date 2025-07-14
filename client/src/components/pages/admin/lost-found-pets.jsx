import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getLostFoundPets, updatePetStatus } from './adminService';
import { Search, Calendar, PawPrint, Ruler, Home, MapPin, User, Heart } from 'lucide-react';

function PetCard({ pet, fetchPets }) {
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(pet.status);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = async () => {
    if (newStatus) {
      try {
        await updatePetStatus(pet._id, newStatus);
        fetchPets(); // Refresh the list
        setOpen(false); // Close the dialog
      } catch (error) {
        console.error('Error updating pet status:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <img
        src={pet.Photo ? `${import.meta.env.VITE_API_URL}${pet.Photo}` : 'https://via.placeholder.com/150'}
        alt={pet.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{pet.name ||pet.Species || 'N/A'}</h3>
        <p className="text-sm text-gray-600">{pet.Breed || 'N/A'} • {pet.Age || 'N/A'} months</p>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{pet.description || 'No description available.'}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0 h-auto mt-2">View Details / Update Status</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Pet Details</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Left Column: Images */}
              <div className="flex flex-col items-center">
                <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  {pet.Photo ? (
                    <img src={`${import.meta.env.VITE_API_URL}${pet.Photo}`} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-4">{pet.name || pet.Species || 'N/A'}</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{pet.Age || 'N/A'} Months</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PawPrint className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Breed</p>
                      <p className="font-medium">{pet.Breed || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-gray-600" /> {/* Using Heart for Gender, can be changed */}
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{pet.Gender || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-medium">{pet.Size || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 mb-4">{pet.description || 'No description available.'}</p>

                <h3 className="text-lg font-semibold mb-2">Health & Vaccinations</h3>
                <ul className="list-none p-0 mb-4">
                  {pet.healthVaccinations && pet.healthVaccinations.length > 0 ? (
                    pet.healthVaccinations.map((vaccine, index) => (
                      <li key={index} className="flex items-center text-green-600">
                        <span className="mr-2">✔</span> {vaccine}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No vaccination information available.</li>
                  )}
                  {/* Add more health details as needed */}
                </ul>

                {/* Update Status Section */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <Label htmlFor="status" className="mb-2 block">Update Status</Label>
                  <Select onValueChange={setNewStatus} value={newStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Lost Details / Updated By Section */}
            <div className="grid md:grid-cols-2 gap-6 p-6 border-t border-gray-200">
              {pet.status === 'lost' && pet.lostDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Lost Details</h3>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <p>Location: {pet.lostDetails.location || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 mt-1">
                    <Calendar className="h-4 w-4" />
                    <p>Lost Date: {formatDate(pet.lostDetails.lostDate)}</p>
                  </div>
                </div>
              )}

              {pet.status === 'found' && pet.foundDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Found Details</h3>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <p>Location: {pet.foundDetails.location || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 mt-1">
                    <Calendar className="h-4 w-4" />
                    <p>Found Date: {formatDate(pet.foundDetails.foundDate)}</p>
                  </div>
                </div>
              )}

              {pet.petOwner && (pet.status === 'lost' || pet.status === 'found') && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Reported By</h3>
                  <div className="flex items-center space-x-3">
                    <img src={pet?.petOwner?.profilePic ? `${import.meta.env.VITE_API_URL}${pet.petOwner.profilePic}` : 'https://via.placeholder.com/40'} alt={pet.petOwner.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{pet.petOwner.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Owner Name</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 pt-0">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusChange}>Update Status</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function LostFoundPets() {
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('lost'); // Default to 'lost' as per image
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPets = async (status = filterStatus, search = searchQuery) => {
    try {
      let petsData = await getLostFoundPets(status, search);
      setData(petsData);
    } catch (error) {
      console.error("Failed to fetch lost/found pets:", error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filterStatus, searchQuery]);

  return (
    <div className="container mx-auto w-full">
      <main className="flex-1 px-6 pb-6 w-full">
        <div className="bg-white rounded-lg h-full p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="lost" className="w-[200px]" onValueChange={setFilterStatus}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="found" >Found</TabsTrigger>
                <TabsTrigger value="lost">Lost</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">{filterStatus === 'lost' ? 'Lost Pets' : 'Found Pets'}</h2>

          <div className="flex flex-wrap gap-6">
            {data.length > 0 ? (
              data.map((pet) => (
                <PetCard key={pet._id} pet={pet} fetchPets={fetchPets} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No pets found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

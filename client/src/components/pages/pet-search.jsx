import { useState, useEffect } from "react";
import { Search, Sliders, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router"; // Import Link

const PetSearch = () => {
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    minAge: "",
    maxAge: "",
    size: "",
    location: "",
  });

  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock data - replace with API call in real implementation
  const mockPets = [
    {
      id: 1,
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      age: 3,
      size: "large",
      location: "New York",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      name: "Whiskers",
      species: "Cat",
      breed: "Siamese",
      age: 2,
      size: "small",
      location: "Los Angeles",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      name: "Rex",
      species: "Dog",
      breed: "German Shepherd",
      age: 5,
      size: "large",
      location: "Chicago",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 4,
      name: "Luna",
      species: "Cat",
      breed: "Maine Coon",
      age: 1,
      size: "medium",
      location: "Miami",
      image: "/placeholder.svg?height=400&width=600",
    },
  ];

  useEffect(() => {
    // Update breeds based on selected species
    if (filters.species) {
      const breeds = [
        ...new Set(
          mockPets
            .filter((pet) => pet.species === filters.species)
            .map((pet) => pet.breed),
        ),
      ];
      setAvailableBreeds(breeds);
    } else {
      setAvailableBreeds([]);
    }
  }, [filters.species]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      species: "",
      breed: "",
      minAge: "",
      maxAge: "",
      size: "",
      location: "",
    });
  };

  const filterPets = (pets) => {
    return pets.filter((pet) => {
      return (
        (!filters.species || pet.species === filters.species) &&
        (!filters.breed || pet.breed === filters.breed) &&
        (!filters.minAge || pet.age >= parseInt(filters.minAge)) &&
        (!filters.maxAge || pet.age <= parseInt(filters.maxAge)) &&
        (!filters.size || pet.size === filters.size) &&
        (!filters.location ||
          pet.location.toLowerCase().includes(filters.location.toLowerCase()))
      );
    });
  };

  const filteredPets = filterPets(mockPets);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Pet
          </h1>
          <div className="relative">
            <Input
              placeholder="Search pets..."
              className="pl-12 pr-4 py-6 text-lg"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Filters and Results */}
        <div className="lg:grid lg:grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-3 space-y-6 ${showMobileFilters ? "block" : "hidden"} lg:block`}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="text-primary"
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-4">
                <Select
                  value={filters.species}
                  onValueChange={(value) =>
                    handleFilterChange("species", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.breed}
                  onValueChange={(value) => handleFilterChange("breed", value)}
                  disabled={!filters.species}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        filters.species
                          ? "Select Breed"
                          : "Select species first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBreeds.map((breed) => (
                      <SelectItem key={breed} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min Age"
                    value={filters.minAge}
                    onChange={(e) =>
                      handleFilterChange("minAge", e.target.value)
                    }
                    min="0"
                  />
                  <Input
                    type="number"
                    placeholder="Max Age"
                    value={filters.maxAge}
                    onChange={(e) =>
                      handleFilterChange("maxAge", e.target.value)
                    }
                    min="0"
                  />
                </div>

                <Select
                  value={filters.size}
                  onValueChange={(value) => handleFilterChange("size", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-9">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Sliders className="mr-2 h-4 w-4" />
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {filteredPets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No pets found matching your criteria. Try adjusting your
                filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <Card
                    key={pet.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="p-0">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p>Species: {pet.species}</p>
                        <p>Breed: {pet.breed}</p>
                        <p>Age: {pet.age} years</p>
                        <p>Size: {pet.size}</p>
                        <p>Location: {pet.location}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link to={`/pets/${pet.id}`} className="w-full">
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSearch;

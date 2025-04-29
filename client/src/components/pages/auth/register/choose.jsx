import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ChooseRegister = () => {
  const navigate = useNavigate();

  const handlePetOwnerClick = () => {
    navigate('/register/pet-owner');
  };

  const handleFosterClick = () => {
    navigate('/register/foster');
  };

  const handleAdopterClick = () => {
    navigate('/register/adopter');
  };

  const handleRescueShelterClick = () => {
    navigate('/register/rescue-shelter');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-2">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Welcome!</h1>
        <p className="text-gray-600 mt-2">Choose your role to get started.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pet Owner</CardTitle>
            <CardDescription>Register your pet or find a new friend.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Additional content can go here if needed */}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button onClick={handlePetOwnerClick}>Register as Pet Owner</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foster</CardTitle>
            <CardDescription>Provide temporary care for pets in need.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Additional content can go here if needed */}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button onClick={handleFosterClick}>Register as Foster</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adopter</CardTitle>
            <CardDescription>Give a loving home to a pet.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Additional content can go here if needed */}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button onClick={handleAdopterClick}>Register as Adopter</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rescue/Shelter</CardTitle>
            <CardDescription>List pets for adoption and manage applications.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Additional content can go here if needed */}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button onClick={handleRescueShelterClick}>Register as Rescue/Shelter</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChooseRegister;

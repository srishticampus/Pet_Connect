
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

  const handlePetShopClick = () => {
    navigate('/register/pet-shop');
  };

  const handleVolunteerClick = () => {
    navigate('/register/volunteer');
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
            <CardTitle>Pet Shop</CardTitle>
            <CardDescription>List your pet shop and connect with pet owners.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Additional content can go here if needed */}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button onClick={handlePetShopClick}>Register as Pet Shop</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volunteer</CardTitle>
            <CardDescription>Help pets in need.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Additional content can go here if needed */}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button onClick={handleVolunteerClick}>Register as Volunteer</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChooseRegister;

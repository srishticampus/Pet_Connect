import AdoptionApplication from "./components/pages/foster/adoption-application";
import AvailablePets from "./components/pages/foster/AvailablePets"; // Import AvailablePets
import PetDetailsAndApply from "./components/pages/foster/PetDetailsAndApply"; // Import PetDetailsAndApply
import { Route, Routes, Navigate } from "react-router"; 
import AllPetsPage from "./components/pages/pet-owner/AllPets"; // Import AllPetsPage

import { Layout } from "./components/pages/layout";
import LandingPage from "./components/pages";
import PetSearch from "./components/pages/pet-search";
import AdminLayout from "./components/pages/admin/layout";
import Dashboard from "./components/pages/admin/dashboard";
import About from "./components/pages/about";
import Login from "./components/pages/auth/login";
import Contact from "./components/pages/contact";
import FostersTable from "./components/pages/admin/fosters"; // Import FostersTable
import RescueSheltersTable from "./components/pages/admin/rescue-shelters"; // Import RescueSheltersTable
import ForgotPassword from "./components/pages/auth/forgot-password";
import ResetPassword from "./components/pages/auth/reset-password";
import ChooseRegister from "./components/pages/auth/register/choose";
import PetOwnerSignUp from "./components/pages/auth/register/pet-owner";
import FosterSignUp from "./components/pages/auth/register/foster";
import AdopterSignUp from "./components/pages/auth/register/adopter";
import RescueShelterSignUp from "./components/pages/auth/register/rescue-shelter";
import PetShopSignUp from "./components/pages/auth/register/pet-shop";
import VolunteerSignUp from "./components/pages/auth/register/volunteer";
import HomePage from "./components/pages/pet-owner/home";
import PetOwnerProfile from "./components/pages/pet-owner/profile";
import PetDetailsPage from "./components/pages/PetDetailsPage"; // Import the new generic PetDetailsPage
import PetOwnersTable from "./components/pages/admin/pet-owners";
import AdoptersTable from "./components/pages/admin/adopters"; // Import AdoptersTable
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import ManagePets from "./components/pages/pet-owner/manage-pets";
import AddPet from "./components/pages/pet-owner/add-pet";
import PetManagement from "./components/pages/admin/pet-management";
import ContactSubmissions from "./components/pages/admin/contact-submissions";
import { useAuth } from "./hooks/auth";
import TermsOfService from "./components/pages/TermsOfService";
import AboutPrivacy from "./components/pages/AboutPrivacy";
import FAQ from "./components/pages/FAQ";
import LogoutPrompt from "./components/pages/auth/LogoutPrompt";
import LostFoundPets from "./components/pages/admin/lost-found-pets";
import FindPet from "./components/pages/pet-owner/find-pet"; // Import FindPet
import AddLostPet from "./components/pages/pet-owner/add-lost-pet"; // Import AddLostPet
import EditLostPet from "./components/pages/pet-owner/edit-lost-pet"; // Import EditLostPet
import ManageLostFoundReports from "./components/pages/pet-owner/ManageLostFoundReports"; // Import ManageLostFoundReports
import RescueShelterAddPet from "./components/pages/rescue-shelter/AddPet"; // Import RescueShelterAddPet
import RescueShelterManagePets from "./components/pages/rescue-shelter/ManagePets"; // Import RescueShelterManagePets
import RescueShelterEditPet from "./components/pages/rescue-shelter/EditPet"; // Import RescueShelterEditPet
import RescueShelterLostFoundReports from "./components/pages/rescue-shelter/LostFoundReports"; // Import RescueShelterLostFoundReports
import AdminApplicationsPage from "./components/pages/admin/applications"; // Import AdminApplicationsPage
import RescueShelterApplicationsPage from "./components/pages/rescue-shelter/Applications"; // Import RescueShelterApplicationsPage
import ChatInterface from "./components/ChatInterface"; // Import ChatInterface
import AdminChatPage from "./components/pages/admin/chat"; // Import AdminChatPage

import EditPet from "./components/pages/pet-owner/edit-pet"; // Import EditPet
import FosterApplicationStatus from "./components/pages/foster/ApplicationStatus"; // Renamed to avoid conflict
import AssignedPets from "./components/pages/foster/AssignedPets"; // Import AssignedPets
import RescueShelterFosteredPets from "./components/pages/rescue-shelter/FosteredPets"; // Import RescueShelterFosteredPets
import RescueShelterAdoptedPets from "./components/pages/rescue-shelter/AdoptedPets"; // Import RescueShelterAdoptedPets
import AdopterApplicationStatus from "./components/pages/adopter/ApplicationStatus"; // Import AdopterApplicationStatus
import AdoptPet from "./components/pages/adopter/AdoptPet"; // Import the new component
import AdoptedPets from "./components/pages/adopter/AdoptedPets"; // Import AdoptedPets

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // if (isLoading) {
  //   return <div>Loading...</div>; // Or a loading spinner
  // }

  const isPetOwner = user?.role === "pet_owner";

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            isAuthenticated && isPetOwner ? (
              <HomePage />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated && isPetOwner ? (
              <HomePage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout-prompt" element={<LogoutPrompt />} />
        <Route path="/register">
          <Route index element={<ChooseRegister />} />
          <Route path="pet-owner" element={<PetOwnerSignUp />} />
          <Route path="foster" element={<FosterSignUp />} />
          <Route path="adopter" element={<AdopterSignUp />} />
          <Route path="rescue-shelter" element={<RescueShelterSignUp />} />
          <Route path="pet-shop" element={<PetShopSignUp />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Added :token */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<ProtectedRoute><PetOwnerProfile /></ProtectedRoute>} />
        <Route path="/pets/:petId" element={<PetDetailsPage />} /> {/* Generic route for pet details */}
        <Route path="/pet-owner/pets/:petId" element={<PetDetailsPage />} /> {/* Existing route now uses generic component */}
        <Route path="/pet-owner/manage-pets" element={<ProtectedRoute><ManagePets /></ProtectedRoute>} />
        <Route path="/pet-owner/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
        <Route path="/pet-owner/edit-pet/:petId" element={<ProtectedRoute><EditPet /></ProtectedRoute>} /> {/* Added EditPet route */}
        <Route path="/pet-owner/find-pet" element={<ProtectedRoute><FindPet /></ProtectedRoute>} /> {/* Added FindPet route */}
        <Route path="/pet-owner/add-lost-pet" element={<ProtectedRoute><AddLostPet /></ProtectedRoute>} /> {/* Added AddLostPet route */}
        <Route path="/pet-owner/edit-lost-pet/:petId" element={<ProtectedRoute><EditLostPet /></ProtectedRoute>} /> {/* Added EditLostPet route */}
        <Route path="/pet-owner/manage-lost-found" element={<ProtectedRoute><ManageLostFoundReports /></ProtectedRoute>} /> {/* Added ManageLostFoundReports route */}
        <Route path="/pet-owner/all-pets" element={<AllPetsPage />} /> {/* Added route for AllPetsPage */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/about-privacy" element={<AboutPrivacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/foster/applications/:applicationId" element={<AdoptionApplication />} />
        {/* Foster routes */}
        <Route path="/foster/pets" element={<AvailablePets />} />
        <Route path="/foster/apply/:petId" element={<PetDetailsAndApply />} />
        <Route path="/foster/application-status" element={<FosterApplicationStatus />} />
        <Route path="/foster/assigned-pets" element={<ProtectedRoute><AssignedPets /></ProtectedRoute>} /> {/* Added AssignedPets route */}
        {/* Adopter routes */}
        <Route path="/adopter/application-status" element={<ProtectedRoute><AdopterApplicationStatus /></ProtectedRoute>} /> {/* Added Adopter Application Status route */}
        <Route path="/adopter/adopt-a-pet" element={<AdoptPet />} /> {/* Added Adopt a Pet route */}
        <Route path="/adopter/adopted-pets" element={<ProtectedRoute><AdoptedPets /></ProtectedRoute>} /> {/* Added Adopted Pets route */}
        {/* Rescue/Shelter routes */}
        <Route path="/rescue-shelter/add-pet" element={<ProtectedRoute><RescueShelterAddPet /></ProtectedRoute>} />
        <Route path="/rescue-shelter/manage-pets" element={<ProtectedRoute><RescueShelterManagePets /></ProtectedRoute>} />
        <Route path="/rescue-shelter/edit-pet/:id" element={<ProtectedRoute><RescueShelterEditPet /></ProtectedRoute>} />
        <Route path="/rescue-shelter/applications" element={<ProtectedRoute><RescueShelterApplicationsPage /></ProtectedRoute>} /> {/* Added Rescue Shelter Applications route */}
        <Route path="/rescue-shelter/lost-found-reports" element={<ProtectedRoute><RescueShelterLostFoundReports /></ProtectedRoute>} /> {/* Added Rescue Shelter Lost Found Reports route */}
        <Route path="/rescue-shelter/adopted-pets" element={<ProtectedRoute><RescueShelterAdoptedPets /></ProtectedRoute>} /> {/* Added RescueShelterAdoptedPets route */}
        <Route path="/rescue-shelter/fostered-pets" element={<ProtectedRoute><RescueShelterFosteredPets /></ProtectedRoute>} /> {/* Added RescueShelterFosteredPets route */}
        <Route path="/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} /> {/* Added Chat route */}
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="fosters" element={<FostersTable />} /> {/* Added Fosters route */}
        <Route path="rescue-shelters" element={<RescueSheltersTable />} /> {/* Added Rescue Shelters route */}
        <Route path="pet-owners" element={<PetOwnersTable />} />
        <Route path="adopters" element={<AdoptersTable />} /> {/* Added Adopters route */}
        <Route path="pet-management" element={<PetManagement />} />
        <Route path="contact-submissions" element={<ContactSubmissions />} />
        <Route path="lost-found-pets" element={<LostFoundPets />} />
        <Route path="applications" element={<AdminApplicationsPage />} /> {/* Added Applications route */}
        <Route path="chat" element={<AdminChatPage />} /> {/* Added Admin Chat route */}
      </Route>
    </Routes>
  );
}

export default App;

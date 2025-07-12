import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  User,
  Users,
  PawPrint,
  FileText,
  Search,
  LogOut,
  Dog,
  MessageSquare, // Import MessageSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import ContactSubmissions from "./contact-submissions";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Pet Owners",
    url: "/admin/pet-owners",
    icon: User,
  },
  {
    title: "Adopters",
    url: "/admin/adopters",
    icon: Users,
  },
  {
    title: "Fosters",
    url: "/admin/fosters",
    icon: PawPrint,
  },
  {
    title: "Rescue Shelters",
    url: "/admin/rescue-shelters",
    icon: PawPrint,
  },
  {
    title: "Pet Management",
    url: "/admin/pet-management",
    icon: Dog,
  },
  {
    title: "Contact Submissions",
    url: "/admin/contact-submissions",
    icon: FileText,
  },
  {
    title: "Lost and Found Pets",
    url: "/admin/lost-found-pets",
    icon: Search,
  },
  {
    title: "Adoption Applications",
    url: "/admin/applications",
    icon: FileText, // Using FileText icon for applications
  },
  {
    title: "Chat",
    url: "/admin/chat",
    icon: MessageSquare, // Using MessageSquare icon for chat
  },
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
  },
];

function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar className="border-none" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="p-4 flex justify-center items-center gap-2 my-4">
            <div>
              <Dog className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Pet Connect</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 py-1 space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="md"
                    asChild
                    className="hover:bg-[#F8F6FF]"
                    isActive={item.url === pathname}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center w-full px-4 text-gray-700  rounded-md transition-colors"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally display an error message to the user
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#F6F7F9]">
        <AppSidebar />

        {/* Main Content Area */}
        <div className=" flex flex-col w-full">
          {/* Header */}
          <header className="flex justify-between items-center p-4 m-6 bg-white rounded-lg">
            <div className="flex items-center gap-4">
              <SidebarTrigger size="32" />
              <h1 className="text-xl text-secondary-foreground">Dashboard</h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Logout</DialogTitle>
                  <hr />

                  <DialogDescription>
                    Are you sure you want to log out ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex sm:justify-center">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-28"
                    onClick={handleLogout}
                  >
                    Yes
                  </Button>
                  <DialogClose asChild>
                    <Button className="w-28">No</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}

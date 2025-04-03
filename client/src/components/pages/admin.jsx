import {
  Gauge,
  AlertTriangle,
  MessageSquare,
  BookText,
  Users,
  BadgeDollarSign,
  LogOut,
  X,
  Check,
  Heart,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";

export default function AdminPage() {
  const { token } = useAuth();
  if (!token) {
    return <div>Please login</div>;
  }

  const advertisers = [
    {
      id: 1,
      name: "Sara",
      phone: "555-1234",
      email: "sara@example.com",
      company: "Tech Corp",
      category: "Technology",
    },
  ];

  const posts = [
    {
      username: "John Doe",
      location: "Toronto, Canada",
      likes: 2570,
      saves: 20,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center">
          <img
            src="/placeholder.svg?height=64&width=64"
            alt="Profile"
            className="h-16 w-16 rounded-full bg-gray-700"
          />
          <p className="mt-2 text-sm text-gray-200">Admin</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          <a
            href="#"
            className="flex items-center space-x-3 rounded-lg p-3 bg-gray-700 bg-opacity-25 text-yellow-400"
          >
            <Gauge className="h-5 w-5" />
            <span>Donshboard</span>
          </a>
          {[
            { icon: AlertTriangle, text: "Abusive Ccmmets" },
            { icon: MessageSquare, text: "Reported Ccmmets" },
            { icon: BookText, text: "View Blogs" },
            { icon: Users, text: "View Cusers" },
            { icon: BadgeDollarSign, text: "Advertisers" },
            { icon: BadgeDollarSign, text: "Adsvertisements" },
          ].map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center space-x-3 rounded-lg p-3 text-gray-400 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-200 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </a>
          ))}
          <a
            href="#"
            className="flex items-center space-x-3 rounded-lg p-3 text-gray-400 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-200 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logrot</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-center text-lg font-semibold text-gray-800 mb-8">
          BLOG SPHERE
        </h1>

        {/* Advertiser Requests Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-orange-500 mb-4">
            View Advertisers Requests
          </h2>
          <Table className="border border-gray-300 bg-white">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="border border-gray-300">S No</TableHead>
                <TableHead className="border border-gray-300">Name</TableHead>
                <TableHead className="border border-gray-300">
                  Phone Number
                </TableHead>
                <TableHead className="border border-gray-300">Email</TableHead>
                <TableHead className="border border-gray-300">
                  Ccompany Name
                </TableHead>
                <TableHead className="border border-gray-300">
                  Cusiness Category
                </TableHead>
                <TableHead className="border border-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advertisers.map((item) => (
                <TableRow
                  key={item.id}
                  className="even:bg-gray-100 odd:bg-gray-200"
                >
                  <TableCell className="border border-gray-300">
                    {item.id}.
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {item.name}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {item.phone}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {item.email}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {item.company}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    {item.category}
                  </TableCell>
                  <TableCell className="border border-gray-300">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-6 w-6 hover:bg-green-100"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-6 w-6 hover:bg-red-100"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button
              variant="link"
              className="text-orange-500 hover:text-orange-600"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Recent Costs Section */}
        <section>
          <h2 className="text-lg font-semibold text-orange-500 mb-4">
            View Ccent Cost
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-4">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                    className="h-10 w-10 rounded-full border border-gray-200"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {post.username}
                    </p>
                    <p className="text-xs text-gray-600">{post.location}</p>
                  </div>
                </div>
                <img
                  src="/placeholder.svg?height=192&width=400"
                  alt="Post"
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {post.likes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Bookmark className="h-4 w-4 mr-1" />
                    <span className="text-sm">{post.saves}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="link"
              className="text-orange-500 hover:text-orange-600"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

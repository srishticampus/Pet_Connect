import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Dog,
  ArrowUpRight,
  User,
  ShoppingCart,
  MoveRight,
  LogOut,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import hero from "./hero.png";
import cardimg1 from "./cardimg-1.png";
import cardimg2 from "./cardimg-2.png";
import cardimg3 from "./cardimg-3.png";

export default function LandingPage({ user }) {
  const stats = [
    { value: "400+", label: "Successful Adoptions" },
    { value: "200+", label: "Volunteers" },
    { value: "8+", label: "Years" },
    { value: "20k+", label: "Pets Rescued" },
  ];

  const cards = [
    {
      title: "Be a Lifesaver – Rescue Stray Animals",
      content:
        "Report animals in need, and our volunteers will step in to rescue, treat, and find them a loving home.",
      image: cardimg1,
    },
    {
      title: "Adopt a Pet - Your Best Friend!",
      content:
        "Give a rescued pet a second chance at happiness. Browse loving cats and dogs waiting for a forever home.",
      image: cardimg2,
    },
    {
      title: "Shop & Support Animal Welfare!",
      content:
        "Get high-quality pet food and accessories while supporting rescue efforts. Every purchase helps rescued animals.",
      image: cardimg3,
    },
  ];

  return (
    <div className="bg-[#F6F7F9] text-[#4c4c4c] min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="py-6 ">
        <div className="container mx-auto px-4 lg:px-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dog className="text-[#E54C00]" size={28} />
            <p className="text-lg font-semibold">PetConnect</p>
          </div>

          {/* Conditional Navigation */}
          {/* Main Navigation - Always Visible */}
          <div className="hidden md:flex gap-6">
            <Link
              href="/"
              className="hover:text-[#E54C00] transition"
              style={{
                textDecoration:
                  window.location.pathname === "/" ? "underline" : "none",
                color: window.location.pathname === "/" ? "#E54C00" : "",
              }}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-[#E54C00] transition"
              style={{
                textDecoration:
                  window.location.pathname === "/about" ? "underline" : "none",
                color: window.location.pathname === "/about" ? "#E54C00" : "",
              }}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#E54C00] transition"
              style={{
                textDecoration:
                  window.location.pathname === "/contact"
                    ? "underline"
                    : "none",
                color: window.location.pathname === "/contact" ? "#E54C00" : "",
              }}
            >
              Contact
            </Link>
          </div>

          {user?.isSuperuser && (
            <div className="hidden md:flex gap-6">
              <Link
                href="/admin/dashboard"
                className="hover:text-[#E54C00] transition"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="hover:text-[#E54C00] transition"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/pets"
                className="hover:text-[#E54C00] transition"
              >
                Pet List
              </Link>
            </div>
          )}

          {!user && (
            <div className="flex gap-8 items-center">
              <Link
                href="/register"
                className="hover:text-[#E54C00] transition"
              >
                Register
              </Link>
              <Button asChild className="bg-[#E54C00] text-white">
                <Link href="/login">
                  Login <MoveRight className="ml-2" size={16} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6 py-16">
            <div className="md:w-1/2">
              <p>YOUR ONE-STEP</p>
              <h1 className="text-5xl font-semibold leading-snug">
                Platform for Pet
                <br />
                <span className="text-[#E54C00]">Adoption &amp; Rescue!</span>
              </h1>
              <p className="text-lg font-light mt-2">
                Whether you're looking to adopt, foster, or reunite a lost pet,
                Pet Connect makes the process seamless and efficient.
              </p>
            </div>
            <div className="md:w-1/2 relative ">
              <img
                src={hero}
                alt="Happy dog"
                fill
                className="rounded-2xl aspect-[16/11] object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <p className="text-4xl text-[#E54C00] font-semibold">
                  {stat.value}
                </p>
                <p className="text-lg font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cards Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 md:grid-rows-2 gap-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden aspect-video"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-xl md:text-2xl font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-white/90 text-sm mt-2">{card.content}</p>
                  <ArrowUpRight
                    className="text-white absolute top-4 right-4"
                    size={24}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* <!-- cta banner --> */}
        <section className="container mx-auto px-3 lg:px-0 py-8">
          <div className="relative p-12  text-white rounded-2xl flex flex-col gap-6 items-start overflow-hidden">
            <div className="cta-gradient -m-12 p-12 w-full h-full absolute z-1">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold">
                  Heroes Without Capes, Join Our Volunteers & Save Innocent
                  Lives Today!
                </h3>
              </div>
              <Link
                to="/"
                className="bg-white w-fit mt-3 text-[#e54c00] px-6 py-2 rounded-full flex text-sm gap-2 items-center"
              >
                Register Now{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-move-right"
                >
                  <path d="M18 8L22 12L18 16" />
                  <path d="M2 12H22" />
                </svg>
              </Link>
            </div>
            <div className="absolute w-full h-full  inset-0 z-0">
              <img
                src={cardimg3}
                alt="volunteer helping a dog"
                className="md:w-1/2 h-full object-cover object-top right-0 absolute rotate-y-180"
              />
            </div>

            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold">
                Heroes Without Capes, Join Our Volunteers & Save Innocent Lives
                Today!
              </h3>
            </div>
            <button className="bg-white text-[#e54c00] px-6 py-2 rounded-full flex text-sm gap-2 items-center">
              Register Now{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-move-right"
              >
                <path d="M18 8L22 12L18 16" />
                <path d="M2 12H22" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#4c4c4c] text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Dog className="text-[#E54C00]" size={48} />
                <p className="text-2xl font-semibold">PetConnect</p>
              </div>
              <p className="text-sm opacity-75">
                A compassionate platform dedicated to rescuing, rehabilitating,
                and rehoming pets.
              </p>
            </div>
            <nav className="flex-1 flex justify-end gap-8">
              <div className="flex flex-col gap-2">
                <Link href="/" className="hover:text-[#E54C00] transition">
                  Home
                </Link>
                <Link href="/shop" className="hover:text-[#E54C00] transition">
                  Shop
                </Link>
                <Link href="/about" className="hover:text-[#E54C00] transition">
                  About
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-[#E54C00] transition"
                >
                  Contact
                </Link>
              </div>
            </nav>
          </div>
          <div className="border-t border-white/20 mt-8 pt-4 text-center md:text-left">
            <p className="text-sm opacity-75">
              &copy; 2025 PetConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

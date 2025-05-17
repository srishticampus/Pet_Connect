import { Link } from "react-router";
import { useAuth } from "../../hooks/auth";
import { ArrowUpRight } from "lucide-react";

import hero from "@/assets/hero.png";
import cardimg1 from "@/assets/cardimg-1.png";
import cardimg2 from "@/assets/cardimg-2.png";
import cardimg3 from "@/assets/cardimg-3.png";
import work1 from "@/assets/work-1.png";
import work2 from "@/assets/work-2.png";
import work3 from "@/assets/work-3.png";

export default function LandingPage() {
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
        "Report animals in need, and our volunteers will step in to rescue, treat, and find them a loving home. Every report brings hope to a helpless pet.",
      image: cardimg1,
    },
    {
      title: "Foster a Pet – Be Their Hero!",
      content:
      "Provide a safe and loving home for a pet in need. Help them heal, grow, and find their forever family.",
      image: cardimg2,
    },
    {
      title: "Adopt a Pet - Your Best Friend!",
      content:
      "Give a rescued pet a second chance at happiness. Browse loving cats and dogs waiting for a forever home .",
      image: cardimg3,
    },
  ];

  const howItWorks = [
    {
      image: work3,
      title: "Discover & Connect",
      content:
        "Browse through verified pet profiles or report a lost/found pet. Use AI-powered breed detection for easy identification.",
    },
    {
      image: work1,
      title: "Apply & Communicate",
      content:
        "Submit an adoption or foster application in just a few clicks. Chat with shelters, rescues, or pet owners in real time.",
    },
    {
      image:  work2,
      title: "Report a Stray Pet",
      content:
        "Complete the adoption or fostering process and bring home a loving companion with joy!",
    },
  ];

  return (
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

      <section className="container mx-auto px-3 lg:px-0 py-8">
        <h2 className="text-2xl font-semibold text-center mb-12 text-[#e54c00]">
          How it works
        </h2>
        <div className="flex flex-col md:flex-row justify-evenly text-center my-8 gap-4">
          {howItWorks.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={item.image}
                alt="dog"
                className="w-24 h-24 object-cover object-center mb-3"
              />
              <h3 className="text-xl text-[#4c4c4c] font-semibold mb-4">
                {item.title}
              </h3>
              <p className="text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* <!&ndash; cta banner &ndash;> */}
      {(() => {
        const { user } = useAuth();
        if (user?.role !== 'admin') {
          return (
            <section className="container mx-auto px-3 lg:px-0 py-8">
              <div className="relative p-12  text-white rounded-2xl flex flex-col gap-6 items-start overflow-hidden">
                <div className="cta-gradient -m-12 p-12 w-full h-full absolute z-1">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-semibold">
                      Be a part of a compassionate network dedicated to pet rescue, adoption, and fostering. Whether you're looking to adopt, foster, or help reunite lost pets, your support makes a difference!
                    </h3>
                  </div>
                  <Link
                    to="/register"
                    className="bg-white w-fit mt-3 text-[#e54c00] px-6 py-2 rounded-full flex text-sm gap-2 items-center"
                  >
                    Join Us Today!{" "}
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
                    Be a part of a compassionate network dedicated to pet rescue, adoption, and fostering. Whether you're looking to adopt, foster, or help reunite lost pets, your support makes a difference!
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
          );
        }
      })()}
    </main>
  );
}

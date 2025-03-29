import {
  PawPrint,
  Heart,
  Search,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

export default function PetConnectLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PawPrint className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold">PetConnect</span>
        </div>
        <div className="flex gap-4">
          <Link
            to={"/auth"}
            className={buttonVariants({ variant: "ghost", size: "lg" })}
          >
            Sign In
          </Link>
          <Link to={"/auth"} className={buttonVariants({ size: "lg" })}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 max-w-3xl mx-auto">
          Find Your New Best Friend or Help a Pet in Need
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A centralized platform for pet adoption, fostering, and reuniting lost
          pets with their families.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Browse Pets</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Adoption Made Easy</h3>
            <p className="text-muted-foreground">
              Browse verified pet profiles and submit applications directly
              through our platform
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Foster Network</h3>
            <p className="text-muted-foreground">
              Join our community of foster caregivers and provide temporary
              homes for pets
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Shelters</h3>
            <p className="text-muted-foreground">
              All partner organizations are thoroughly vetted for your peace of
              mind
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            For Everyone Who Cares
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: "Adopters",
                desc: "Find your perfect pet match",
              },
              { icon: Heart, title: "Fosters", desc: "Provide temporary care" },
              {
                icon: ShieldCheck,
                title: "Shelters",
                desc: "Manage your pets",
              },
              {
                icon: MessageSquare,
                title: "Owners",
                desc: "Report lost pets",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <footer className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join thousands of pet lovers already using PetConnect to change
          animals' lives
        </p>
        <Link to={"/auth"} className={buttonVariants({ size: "lg" })}>
          Get Started Now
        </Link>
      </footer>
    </div>
  );
}

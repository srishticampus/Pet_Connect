import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, PawPrint, ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";

const SignInForm = ({ onSignUpClick }) => {
  const form = useForm();

  const onSubmit = (data) => {
    console.log("Sign In Form submitted:", data);
  };

  return (
    <>
      <div className="text-center">
        <PawPrint className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight">
          Welcome Back!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sign in to continue to PetConnect
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSignUpClick}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </p>
    </>
  );
};

const SignUpForm = ({ onSignInClick }) => {
  const [role, setRole] = useState("adopter");
  const form = useForm();
  const { handleSubmit, watch } = form;
  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Sign Up Form submitted:", { ...data, role });
  };

  return (
    <>
      <div className="text-center">
        <PawPrint className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight">
          Create Account
        </h2>
        <p className="mt-2 text-muted-foreground">
          Join our pet adoption community
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Account Type</FormLabel>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adopter">Pet Adopter</SelectItem>
                <SelectItem value="foster">Foster Parent</SelectItem>
                <SelectItem value="shelter">Shelter/Rescue</SelectItem>
                <SelectItem value="owner">Pet Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignInClick}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </p>
    </>
  );
};

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Form Section */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <Button
            variant=""
            className="absolute top-4 left-4 hover:bg-accent hover:text-primary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Back
          </Button>

          {isLogin ? (
            <SignInForm onSignUpClick={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onSignInClick={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

import { MapPin, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import axios from 'axios';
import api from "@/utils/api";

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/contact', {
        name,
        email,
        comments,
      });
      console.log(response.data); // Log success message
      // Reset form fields
      setName('');
      setEmail('');
      setComments('');
      alert('Form submitted successfully!'); // Show success message
    } catch (error) {
      console.error(error.response.data); // Log error message
      alert('Form submission failed!'); // Show error message
    }
  };

  return (
    <>
      <section className="container mx-auto px-3 lg:px-0 py-12 text-center">
        <p>Contact Us</p>
        <h1 className="text-3xl font-semibold leading-snug text-[#e54c00] my-6">
          We're here to help!
        </h1>
        <p className="text-sm font-light py-2">
          Have a question or need help? We're here to help. Please fill out the
          form below and we'll get back to you as soon as possible.
        </p>
      </section>

      {/* Form */}
      <div className="bg-white">
        <section className="container mx-auto px-3 lg:px-0 py-12">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 w-full flex-col mx-auto border border-[#ccc] p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <label htmlFor="name">Name</label>
              <Input
                type="text"
                name="name"
                id="name"
                className="mt-1 mb-3"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                name="email"
                id="email"
                className="mt-1 mb-3"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="comments">Comments</label>
              <Textarea
                name="comments"
                id="comments"
                cols="30"
                rows="10"
                className="mt-1 mb-3 h-48"
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></Textarea>
              <Button type="submit">Submit</Button>
            </form>
            {/* Contact info */}
            <div className="flex flex-1 w-full flex-col justify-evenly gap-6 ml-6">
              <div className="flex items-center gap-8 p-6 border border-[#ccc] rounded-2xl">
                <div className="w-16 h-16 rounded-full border border-[#ccc] flex justify-center items-center">
                  <Phone />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg mb-3">+91 123 456 7890</p>
                  <p className="text-sm">Available Monday to Friday</p>
                  <p className="text-sm">9:00am to 5:00pm</p>
                </div>
              </div>
              <div className="flex items-center gap-8 p-6 border border-[#ccc] rounded-2xl">
                <div className="w-16 h-16 rounded-full border border-[#ccc] flex justify-center items-center">
                  <Mail />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg mb-3">pawheaven@gmail.com</p>
                  <p className="text-sm">
                    We will respond within 24 hours on weekdays.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8 p-6 border border-[#ccc] rounded-2xl">
                <div className="w-16 h-16 rounded-full border border-[#ccc] flex justify-center items-center">
                  <MapPin />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg mb-3">
                    pawheaven Headquarters, 1234 Avenue, Suite 567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;

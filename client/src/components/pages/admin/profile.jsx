import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAdminProfile } from './adminService'; // Import the new service function

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const data = await getAdminProfile();
        setAdminData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) {
    return <div className="p-6">Loading admin profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  if (!adminData) {
    return <div className="p-6">No admin data found.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Profile</h2>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Name:</span>
            <span>{adminData.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium">Email:</span>
            <span>{adminData.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium">Role:</span>
            <span>{adminData.role}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium">Last Login:</span>
            <span>{adminData.lastLogin}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfilePage;

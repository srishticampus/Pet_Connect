import React, { useEffect, useState } from 'react';
import { getOwnedApplications, approveApplicationByOwner, rejectApplicationByOwner } from './rescueShelterService'; // Assuming service functions will be here
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Assuming a Badge component for status
import { ExternalLink } from "lucide-react"; // For View More link icon

const RescueShelterApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const applicationsData = await getOwnedApplications();
      setApplications(applicationsData);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch owned applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await approveApplicationByOwner(applicationId);
      // Update the status in the local state or refetch
      fetchApplications();
    } catch (err) {
      console.error("Failed to approve application:", err);
      // Optionally show an error message to the user
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await rejectApplicationByOwner(applicationId);
      // Update the status in the local state or refetch
      fetchApplications();
    } catch (err) {
      console.error("Failed to reject application:", err);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading applications: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Applications for Your Pets</h1>
      <div className="grid gap-6">
        {applications.map((app) => (
          <Card key={app._id}>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Pet Info */}
              <div className="flex items-center gap-4">
                <img src={`${import.meta.env.VITE_API_URL}${app.pet?.Photo}`} alt={app.pet?.name} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <h3 className="text-xl font-semibold">{app.pet?.name}</h3>
                  <p className="text-sm text-gray-600">{app.pet?.Breed}</p>
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    View More <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Applicant:</strong> {app.applicant?.name || 'N/A'}</div>
                <div><strong>Phone:</strong> {app.applicant?.phoneNumber || 'N/A'}</div>
                <div><strong>Email:</strong> {app.applicant?.email || 'N/A'}</div>
                <div><strong>Location:</strong> {app.applicant?.place || 'N/A'}</div>
                <div><strong>Aadhaar:</strong> {app.applicant?.aadharNumber || 'N/A'}</div>
                <div><strong>Status:</strong> <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'destructive' : 'default'}>{app.status}</Badge></div>
                 {app.message && <div className="col-span-2"><strong>Message:</strong> {app.message}</div>}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 justify-center">
                 {app.status === 'pending' && (
                  <>
                    <Button onClick={() => handleApprove(app._id)}>Approve</Button>
                    <Button variant="outline" onClick={() => handleReject(app._id)}>Reject</Button>
                  </>
                )}
                 {app.status !== 'pending' && (
                    <p className="text-center text-gray-500">Application {app.status}</p>
                 )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RescueShelterApplicationsPage;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/utils/api'; // Assuming an API utility for requests
import { toast } from 'sonner'; // For notifications
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RescueShelterLostFoundReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rescue-shelter/lost-found-reports');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching rescue shelter lost/found reports:', err);
      setError('Failed to load lost/found reports. Please try again later.');
      toast.error('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (petId, newStatus) => {
    try {
      await api.put(`/rescue-shelter/lost-found-reports/${petId}/status`, { status: newStatus });
      toast.success(`Pet status updated to ${newStatus} successfully!`);
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error('Error updating pet status:', err);
      toast.error('Failed to update pet status.');
    }
  };

  const handleChatWithReporter = (reporterId) => {
    if (reporterId) {
      navigate(`/chat?initialChatPartnerId=${reporterId}&chatTargetRole=pet-owner`);
    } else {
      toast.error("Reporter information not available for chat.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading lost/found reports...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Lost & Found Reports</h1>
      {reports.length === 0 ? (
        <p className="text-gray-600">No lost or found pet reports relevant to your organization.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report._id} className="pt-0 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={report.Photo ? `${import.meta.env.VITE_API_URL}${report.Photo}` : 'https://via.placeholder.com/300'} // Placeholder image
                alt={report.name}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{report.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700"><strong>Species:</strong> {report.Species}</p>
                <p className="text-gray-700"><strong>Breed:</strong> {report.Breed}</p>
                <p className="text-gray-700"><strong>Status:</strong> <span className={`font-semibold ${
                  report.status === 'lost' ? 'text-red-600' : 'text-green-600'
                }`}>{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span></p>
                <p className="text-gray-700"><strong>Last Seen:</strong> {new Date(report.lostDate).toLocaleDateString()}</p>
                <p className="text-gray-700"><strong>Location:</strong> {report.Location}</p>
                {report.petOwner?.name && (
                  <p className="text-gray-700"><strong>Reported By:</strong> {report.petOwner.name} ({report.petOwner.email})</p>
                )}
                <div className="mt-4 flex flex-col gap-2">
                  <Link to={`/pets/${report._id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                  {report.status === 'lost' && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="secondary" className="w-full">Mark as Found</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Mark Pet as Found</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to mark this pet as found? This will update its status.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUpdateStatus(report._id, 'found')}>Confirm</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  {report.petOwner?._id && report.petOwner.role === 'pet_owner' && ( // Only show chat if reported by a pet owner
                    <Button variant="outline" className="w-full" onClick={() => handleChatWithReporter(report.petOwner._id)}>
                      Chat with Reporter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RescueShelterLostFoundReports;

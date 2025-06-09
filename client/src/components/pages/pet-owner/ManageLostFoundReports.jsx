import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import petOwnerService from './petOwnerService';
import { toast } from 'sonner';
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
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const ManageLostFoundReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId'); // Get current user ID

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Use the new service function
      const data = await petOwnerService.getLostFoundReportsForPetOwner();
      setReports(data);
    } catch (err) {
      console.error('Error fetching lost/found reports:', err);
      setError('Failed to load lost/found reports. Please try again later.');
      toast.error('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMarkAsFound = async (petId) => {
    try {
      await petOwnerService.markPetAsFound(petId);
      toast.success('Pet marked as found successfully!');
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error('Error marking pet as found:', err);
      toast.error('Failed to mark pet as found.');
    }
  };

  const handleChatWithReporter = (reporterId, reporterRole) => {
    navigate(`/chat?initialChatPartnerId=${reporterId}&chatTargetRole=${reporterRole}`);
  };

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Lost & Found Reports</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-lg">
              <Skeleton className="w-full h-48" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">You have not submitted any lost or found pet reports yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            // Determine pet name, species, breed, and location based on report type
            const petName = report.reportType === 'lost' ? report.petName : report.matchedPet?.name || 'N/A';
            const species = report.reportType === 'lost' ? 'N/A' : report.matchedPet?.Species || 'N/A'; // Assuming Species/Breed are on matchedPet
            const breed = report.reportType === 'lost' ? 'N/A' : report.matchedPet?.Breed || 'N/A';
            const displayLocation = report.reportType === 'lost' ? report.lastSeenLocation : report.foundLocation;
            const displayDate = new Date(report.createdAt).toLocaleDateString();
            const isReportedByMe = report.reportingUser?._id === currentUserId;

            return (
              <Card key={report._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={report.image ? `${import.meta.env.VITE_API_URL}/${report.image}`:'https://via.placeholder.com/300'} // Use report.image
                  alt={petName}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{petName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700"><strong>Report Type:</strong> <span className={`font-semibold ${
                    report.reportType === 'lost' ? 'text-red-600' : 'text-green-600'
                  }`}>{report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)}</span></p>
                  <p className="text-gray-700"><strong>Species:</strong> {species}</p>
                  <p className="text-700"><strong>Breed:</strong> {breed}</p>
                  <p className="text-gray-700"><strong>Description:</strong> {report.petDescription}</p>
                  <p className="text-gray-700"><strong>Date:</strong> {displayDate}</p>
                  <p className="text-gray-700"><strong>Location:</strong> {displayLocation}</p>
                  {report.reportingUser && (
                    <p className="text-gray-700">
                      <strong>Reported By:</strong> {isReportedByMe ? 'You' : report.reportingUser.username}
                    </p>
                  )}
                  <div className="mt-4 flex flex-col gap-2">
                    {/* Only show "View Details" if there's a matched pet or it's a lost pet reported by owner */}
                    {(report.matchedPet || (report.reportType === 'lost' && isReportedByMe)) && (
                      <Link to={`/pets/${report.matchedPet?._id || report._id}`} className="w-full">
                        <Button className="w-full">View Details</Button>
                      </Link>
                    )}

                    {/* Chat with Reporter button */}
                    {report.reportType === 'found' && report.reportingUser && !isReportedByMe && (
                      <Button
                        variant="default"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleChatWithReporter(report.reportingUser._id, report.reportingUser.role)}
                      >
                        Chat with Reporter
                      </Button>
                    )}

                    {/* Mark as Found button (only for lost reports made by current user) */}
                    {report.reportType === 'lost' && isReportedByMe && (
                      <>
                        <Link to={`/pet-owner/edit-lost-pet/${report._id}`} className="w-full">
                          <Button variant="outline" className="w-full">Edit Report</Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="secondary" className="w-full">Mark as Found</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Mark Pet as Found</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to mark this pet as found? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleMarkAsFound(report._id)}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageLostFoundReports;

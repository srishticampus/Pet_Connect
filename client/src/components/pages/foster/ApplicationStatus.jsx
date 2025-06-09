import React, { useEffect, useState } from 'react';
import { getFosterApplications } from './fosterService';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getFosterApplications();
        setApplications(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-8">Loading applications...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">Error loading applications: {error.message}</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Application Status</h1>
        <p>No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Application Status</h1>
      <div className="grid grid-cols-1 gap-6">
        {applications.map((application) => (
          <div key={application.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  className="w-full h-72 object-cover"
                  src={application.pet.Photo? `${import.meta.env.VITE_API_URL}${application.pet.Photo}`: 'https://placedog.net/200/150'} // Use actual image or placeholder
                  alt={application.pet.name}
                />
              </div>
              <div className="md:w-2/3 p-4">
                <h2 className="text-xl font-semibold mb-2">{application.pet.name}</h2>
                <div className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 4.75 7.5 4.75a8.282 8.282 0 00-2.599.49c-.166.034-.32.084-.465.148-.422.192-.841.41-.931.93-.065.397-.096.837-.097 1.297l-.003 6.433c.002 0.422.034 0.839.096 1.288.089.542.529.763.951.95.191.085.385.142.58.186a8.282 8.282 0 002.599.491c1.747 0 3.332-.726 4.5-1.548m7.394 4.241L12 6.253m0 0v13m0-13C13.168 5.477 14.754 4.75 16.5 4.75a8.282 8.282 0 012.599.49c.166.034.32.084.465.148.422.192.841.41.931.93.065.397.096.837.097 1.297l.003 6.433c-.002 0.422-.034 0.839-.096 1.288-.089.542-.529.763-.951.95-.191.085-.385.142-.58.186a8.282 8.282 0 01-2.599.491c-1.747 0-3.332-.726-4.5-1.548m-7.394 4.241L12 6.253"/></svg>
                  <span>Age: {application.pet.Age}</span>
                </div>
                <div className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5.41a0.5 0.5 0 01.474.337L6.5 13m1.154-5h1.446c.073 0 .145.003.217.008a.5.5 0 01.496.562l1.258 8.577a.5.5 0 01-.558.644H15.5m-1.579-8.5H9.77a0.5 0.5 0 01-.473-.337L8.5 11m1.154 5h1.446c.073 0 .145.003.217.008a.5.5 0 00.496-.562l-1.258-8.577a.5.5 0 00.558-.644H8.5m-1.579 8.5H15.5m1.579-8.5H9.77a0.5 0.5 0 00.473.337L17.5 11m1.154 5h1.446c.073 0 .145.003.217.008a.5.5 0 00.496-.562l-1.258-8.577a.5.5 0 00.558-.644H15.5"/></svg>
                  <span>Breed: {application.pet.Breed}</span>
                </div>
                <div className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m2-6h12m-1.124-9.725l1.121.125a1.5 1.5 0 011.344 1.348l-.099.995a1.5 1.5 0 01-1.176 1.412l-.775.113a1.5 1.5 0 00-1.197 1.423l.055.71a1.5 1.5 0 01-1.234 1.309l-.697.102a1.5 1.5 0 00-1.135 1.492l.077.648a1.5 1.5 0 01-1.299 1.201l-.614.075a1.5 1.5 0 00-1.159 1.566l.024.403a1.5 1.5 0 01-1.325 1.08l-.55.082a1.5 1.5 0 00-1.224 1.548L3.75 15.75m18 0v-2a6 6 0 00-6-6H3.75m18 0h-1.5m-2.25-15h.008v.008H21.75V.75m-5.25 0h.008v.008h-.008V.75m-8.498-1.242l.585.585a2.34 2.34 0 003.286 3.286l-.585.585m3.748 8.748l-.586.585M9.25 15.75H3.75"/></svg>
                  <span>Gender: {application.pet.Gender}</span>
                </div>
                <div className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m2-6h12m-1.124-9.725l1.121.125a1.5 1.5 0 011.344 1.348l-.099.995a1.5 1.5 0 01-1.176 1.412l-.775.113a1.5 1.5 0 00-1.197 1.423l.055.71a1.5 1.5 0 01-1.234 1.309l-.697.102a1.5 1.5 0 00-1.135 1.492l.077.648a1.5 1.5 0 01-1.299 1.201l-.614.075a1.5 1.5 0 00-1.159 1.566l.024.403a1.5 1.5 0 01-1.325 1.08l-.55.082a1.5 1.5 0 00-1.224 1.548L3.75 15.75m18 0v-2a6 6 0 00-6-6H3.75m18 0h-1.5m-2.25-15h.008v.008H21.75V.75m-5.25 0h.008v.008h-.008V.75m-8.498-1.242l.585.585a2.34 2.34 0 003.286 3.286l-.585.585m3.748 8.748l-.586.585M9.25 15.75H3.75"/></svg>
                  <span>Size: {application.pet.Size}</span>
                </div>
              </div>
              <div className="md:w-1/3 p-4 flex flex-col justify-center items-center">
                <div className="text-gray-600 mb-2">Application Status</div>
                {application.status === 'approved' && (
                  <div className="flex items-center text-green-500">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    Approved
                  </div>
                )}
                {application.status === 'pending' && (
                  <div className="flex items-center text-yellow-500">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Pending
                  </div>
                )}
                 {application.status === 'rejected' && (
                  <div className="flex items-center text-red-500">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {application.rejectionReason ? application.rejectionReason : "Rejected"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatus;
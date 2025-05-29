import { useState } from "react";
import ApplicationForm from "../components/ApplicationForm";
import AdminDashboard from "../components/AdminDashboard";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">
            {isAdmin ? "Admin Dashboard" : "Student Application Form"}
          </h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent-orange transition-colors"
          >
            {isAdmin ? "View Application Form" : "View Admin Dashboard"}
          </button>
        </div>

        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <div className="flex justify-center">
            <ApplicationForm />
          </div>
        )}
      </div>
    </div>
  );
}

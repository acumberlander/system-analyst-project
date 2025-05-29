import { useState } from "react";
import { createStudent } from "../pages/api/students";
import { containsProfanity } from "../utils/containsProfanity";

export default function ApplicationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    program: "",
    start_term: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Profanity check for each field
    for (const [key, value] of Object.entries(form)) {
      if (containsProfanity(value)) {
        setStatus(
          `⚠️ Inappropriate language detected in "${key}". Please revise.`
        );
        return;
      }
    }

    setStatus("Submitting...");
    try {
      await createStudent(form);
      setStatus("✅ Submission successful!");
      setForm({ name: "", email: "", program: "", start_term: "" });
    } catch (error) {
      console.error(error);
      setStatus("❌ Submission failed. Try again.");
    }
  };

  return (
    <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-primary mb-6 text-center">
        New Student Onboarding
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-orange focus:outline-none"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-orange focus:outline-none"
            placeholder="jane.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Program of Interest
          </label>
          <input
            name="program"
            value={form.program}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-orange focus:outline-none"
            placeholder="Computer Science"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Term
          </label>
          <input
            name="start_term"
            value={form.start_term}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-orange focus:outline-none"
            placeholder="Fall 2025"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-medium py-2 rounded-md hover:bg-accent-orange transition"
        >
          Submit Application
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center text-sm text-gray-700">{status}</p>
      )}
    </div>
  );
}

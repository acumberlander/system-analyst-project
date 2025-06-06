import { useState, useEffect } from "react";
import { getStudents, deleteStudent, updateStudent, createStudent } from "../pages/api/students";
import { Student } from "../types/student";
import { mockStudents } from "../data/mockStudents";
import { ThreeDot } from "react-loading-indicators";

type SortField = 'name' | 'program' | 'start_term' | 'created_at' | null;
type SortDirection = 'asc' | 'desc';

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverIsSleep, setServerIsSleep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingMock, setIsAddingMock] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
      setError(null);
      const timeout = setTimeout(() => {
        setServerIsSleep(true);
      }, 5000);
      return () => clearTimeout(timeout);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
      setServerIsSleep(false);
    }
  };

  const handleAddMockStudents = async () => {
    if (window.confirm("Are you sure you want to add mock students? This will add 25 new students to the database.")) {
      setIsAddingMock(true);
      setError(null);
      try {
        await Promise.all(
          mockStudents.map(student => createStudent(student))
        );
        await fetchStudents();
      } catch (err) {
        setError("Failed to add mock students");
        console.error(err);
      } finally {
        setIsAddingMock(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(student => student.id !== id));
        setError(null);
      } catch (err) {
        setError("Failed to delete student");
        console.error(err);
      }
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleUpdate = async (updatedStudent: Student) => {
    try {
      await updateStudent(updatedStudent);
      setStudents(students.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      ));
      setEditingStudent(null);
      setError(null);
    } catch (err) {
      setError("Failed to update student");
      console.error(err);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatName = (fullName: string | undefined | null) => {
    if (!fullName) return '';
    
    const nameParts = fullName.split(' ');
    if (nameParts.length < 2) return fullName;
    
    const lastName = nameParts.pop() || '';
    const firstName = nameParts.join(' ');
    return `${lastName}, ${firstName}`;
  };

  const getSortedStudents = () => {
    if (!sortField) return students;

    return [...students].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          const aLastName = a.name.split(' ').pop() || '';
          const bLastName = b.name.split(' ').pop() || '';
          comparison = aLastName.localeCompare(bLastName);
          break;
        case 'program':
          comparison = a.program.localeCompare(b.program);
          break;
        case 'start_term':
          comparison = a.start_term.localeCompare(b.start_term);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const downloadCSV = () => {
    const dataToExport = getSortedStudents();
    const headers = ['Name', 'Email', 'Program', 'Start Term', 'Submitted'];
    
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(student => [
        `"${student.name}"`,
        `"${student.email}"`,
        `"${student.program}"`,
        `"${student.start_term}"`,
        `"${new Date(student.created_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `student_applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all students? This action cannot be undone.")) {
      setIsDeletingAll(true);
      setError(null);
      try {
        await Promise.all(students.map(student => deleteStudent(student.id ?? "")));
        setStudents([]);
      } catch (err) {
        setError("Failed to delete all students");
        console.error(err);
      } finally {
        setIsDeletingAll(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-start flex-col pt-28">
        <div className="text-primary text-xl">
          <ThreeDot
            variant="bounce"
            color="#016937"
            size="medium"
            text="Loading..."
            textColor=""
          />
        </div>
        {serverIsSleep && (
          <div className="text-red-500 text-xl mt-4">
            Render server is sleeping. Please wait...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Student Applications Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent-orange transition-colors"
          >
            Download CSV
          </button>
          <button
            onClick={handleAddMockStudents}
            disabled={isAddingMock}
            className="px-4 py-2 bg-accent-orange text-white rounded-md hover:bg-accent-yellow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingMock ? "Adding Mock Students..." : "Add Mock Students"}
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll || students.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeletingAll ? "Deleting..." : "Delete All Students"}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('program')}
                >
                  Program {getSortIcon('program')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('start_term')}
                >
                  Start Term {getSortIcon('start_term')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  Submitted {getSortIcon('created_at')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getSortedStudents().map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatName(student.name)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.start_term}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(student.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-accent-orange hover:text-accent-yellow mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id ?? "")}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-primary mb-4">Edit Student</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingStudent);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-orange focus:ring-accent-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-orange focus:ring-accent-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <input
                    type="text"
                    value={editingStudent.program}
                    onChange={(e) => setEditingStudent({...editingStudent, program: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-orange focus:ring-accent-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Term</label>
                  <input
                    type="text"
                    value={editingStudent.start_term}
                    onChange={(e) => setEditingStudent({...editingStudent, start_term: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-orange focus:ring-accent-orange"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent-orange"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
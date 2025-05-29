import axios from 'axios';
import { Student } from '../../types/student';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Creates a new student in the database
 * @param student - The student object to create
 * @returns The created student object
 */
export const createStudent = async (student: Omit<Student, 'id' | 'user_id' | 'created_at'>): Promise<Student> => {
  const res = await axios.post(`${API_URL}/students`, student);
  return res.data;
};

/**
 * Gets all students from the database
 * @returns An array of student objects
 */
export const getStudents = async (): Promise<Student[]> => {
  const res = await axios.get(`${API_URL}/students`);
  return res.data;
};

/**
 * Gets a student from the database
 * @param id - The id of the student to get
 * @returns The student object
 */
export const getStudent = async (id: string): Promise<Student> => {
  const res = await axios.get(`${API_URL}/students/${id}`);
  return res.data;
};

/**
 * Updates a student in the database
 * @param student - The student object to update
 * @returns The updated student object
 */
export const updateStudent = async (student: Student): Promise<Student> => {
  const res = await axios.put(`${API_URL}/students/${student.id}`, student);
  return res.data;
};

/**
 * Deletes a student from the database
 * @param id - The id of the student to delete
 */
export const deleteStudent = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/students/${id}`);
};

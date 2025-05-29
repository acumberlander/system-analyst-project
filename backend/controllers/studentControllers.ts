import pool from "../lib/db";
import { Request, Response } from "express";

/**
 * Create a new student using raw SQL
 */
export const createStudent = async (req: Request, res: Response) => {
  console.log('Creating student:', req.body);
  const { name, email, program, start_term } = req.body;

  if (!name || !email || !program || !start_term) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const text = `
    INSERT INTO students (name, email, program, start_term)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, email, program, start_term];

  try {
    const result = await pool.query(text, values);
    console.log('Student created:', result.rows[0]);
    res.status(200).json({
      message: "Student inserted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("[Insert Error]", error);
    res.status(500).json({ 
      error: "Failed to insert student.",
      details: error.message 
    });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  console.log('Getting all students');
  const text = "SELECT * FROM students ORDER BY created_at DESC";

  try {
    const result = await pool.query(text);
    console.log(`Found ${result.rows.length} students`);
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("[Select Error]", error);
    res.status(500).json({ 
      error: "Failed to get students.",
      details: error.message 
    });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('Getting student:', id);
  
  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  const text = "SELECT * FROM students WHERE id = $1";

  try {
    const result = await pool.query(text, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log('Found student:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("[Select Error]", error);
    res.status(500).json({ 
      error: "Failed to get student.",
      details: error.message 
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, program, start_term } = req.body;
  console.log('Updating student:', id, req.body);

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  if (!name || !email || !program || !start_term) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const text = `
    UPDATE students
    SET name = $1, email = $2, program = $3, start_term = $4
    WHERE id = $5
    RETURNING *;
  `;

  const values = [name, email, program, start_term, id];

  try {
    const result = await pool.query(text, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log('Student updated:', result.rows[0]);
    res.status(200).json({
      message: "Student updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("[Update Error]", error);
    res.status(500).json({ 
      error: "Failed to update student.",
      details: error.message 
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('Deleting student:', id);

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  const text = "DELETE FROM students WHERE id = $1 RETURNING *";

  try {
    const result = await pool.query(text, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log('Student deleted:', result.rows[0]);
    res.status(200).json({
      message: "Student deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("[Delete Error]", error);
    res.status(500).json({ 
      error: "Failed to delete student.",
      details: error.message 
    });
  }
};

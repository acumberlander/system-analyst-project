import express, { Router, RequestHandler } from "express";
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from "../controllers/studentControllers";

const router: Router = express.Router();

router.post("/", createStudent as RequestHandler);
router.get("/", getStudents as RequestHandler);
router.get("/:id", getStudent as RequestHandler);
router.put("/:id", updateStudent as RequestHandler);
router.delete("/:id", deleteStudent as RequestHandler);

export default router;

import express from "express";
import { getStudentRatings, getSubjectStudentRatings, saveStudentRating } from "../controllers/student-rating-controller.js";
import { verifyToken } from "../middlewares/jwt.js";

const router = express.Router();

router.get("/subject/:subjectId", verifyToken, getSubjectStudentRatings);
router.get("/:studentUserId", verifyToken, getStudentRatings);
router.post("/", verifyToken, saveStudentRating);

export default router;

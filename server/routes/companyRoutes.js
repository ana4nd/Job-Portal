import express from "express";
import { changeJobApplicationStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from "../controller/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middleware/authMiddleware.js";
const router = express.Router();

// Register a company
router.post("/register",upload.single("image"),registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company", protectCompany, getCompanyData);

// Post a job
router.post("/post-job",protectCompany, postJob);

// Get Applicants Data of company
router.get("/applicants", protectCompany, getCompanyJobApplicants);

// Get compnay job list
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// change application status
router.post('/change-status', protectCompany, changeJobApplicationStatus);

// chnage application visibility
router.post("/change-visibility", protectCompany, changeVisiblity);

export default router;
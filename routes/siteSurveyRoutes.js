const express = require("express");
const siteSurveyController = require("../controllers/siteSurveyController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// Get all site surveys for the authenticated user
router.get("/", isAuthenticatedUser, siteSurveyController.getAllSurveysForUser);

router.get("/all", isAuthenticatedUser,authorizeRoles('admin') , siteSurveyController.getAllSurveys);

// Get a specific site survey by ID for the authenticated user
router.get("/:id", isAuthenticatedUser, siteSurveyController.getSurveyByIdForUser);

// Create a new site survey for the authenticated user
router.post("/", isAuthenticatedUser, siteSurveyController.createSurveyForUser);

// Update a site survey by ID for the authenticated user
router.put("/:id", isAuthenticatedUser, siteSurveyController.updateSurveyForUser);

// Delete a site survey by ID for the authenticated user
router.delete("/:id", isAuthenticatedUser, siteSurveyController.deleteSurveyForUser);

module.exports = router;

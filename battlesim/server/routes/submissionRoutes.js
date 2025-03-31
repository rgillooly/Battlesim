const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/project");

const router = express.Router();

// POST route to create a new project
router.post("/", async (req, res) => {
  try {
    console.log("Post request initiated");

    const { projectName, projectDescription, projectLink } = req.body;

    // Validate request body
    if (!projectName || !projectDescription || !projectLink) {
      return res.status(400).json({
        success: false,
        message: "All fields must be filled in",
      });
    }

    const newProject = new Project({
      projectName,
      projectDescription,
      projectLink,
    });

    await newProject.save();

    res.status(201).json({
      success: true, // Fixed typo
      message: "Project Posted Successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error posting project:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET route to fetch all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find(); // Fixed incorrect method call

    const formattedProjects = projects.map((project) => ({
      id: project._id,
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      projectLink: project.projectLink,
    }));

    res.status(200).json({ success: true, projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);

    res.status(500).json({
      success: false,
      message: "Server error", // Fixed typo
      error: error.message,
    });
  }
});

module.exports = router;

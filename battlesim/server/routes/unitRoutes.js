const express = require("express");
const router = express.Router();
const Unit = require("../models/unit");

// Route to fetch all units
router.get("/all", async (req, res) => {
  try {
    // Fetch all units from the database
    const units = await Unit.find(); // You can also add filtering, pagination, etc.

    // If no units found
    if (!units.length) {
      return res
        .status(404)
        .json({ success: false, message: "No units found." });
    }

    // Return the units as a response
    res.status(200).json({ success: true, units });
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching units",
      error: error.message,
    });
  }
});

// Route to add a new unit (protected by JWT authentication)

router.post("/add", async (req, res) => {
  try {
    const { name, attack, health, weakness, abilities } = req.body;

    if (!name || !attack || !health) {
      return res.status(400).json({
        success: false,
        message: "Name, attack, and health are required.",
      });
    }

    const newUnit = new Unit({
      name,
      attack,
      health,
      weakness: weakness || "None",
      abilities: abilities || [],
    });

    await newUnit.save();
    res.status(201).json({
      success: true,
      message: "Unit added successfully",
      unit: newUnit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding unit",
      error: error.message,
    });
  }
});

module.exports = router;

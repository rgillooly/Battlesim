const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  attack: { type: Number, required: true },
  health: { type: Number, required: true },
  weakness: { type: String, default: "None" },
  abilities: [{ type: String }], // Array of special abilities
  createdAt: { type: Date, default: Date.now },
});

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;

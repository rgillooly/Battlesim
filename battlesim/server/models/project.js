const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    projectName: String,
    projectDescription: String,
    projectLink: String,
})

module.exports = mongoose.model("Project", ProjectSchema);
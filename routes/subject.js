const express = require("express");
const subjectCrud = require("../cruds/subject"); // Update the path as necessary
const subjectRouter = express.Router();

// Create a new subject
subjectRouter.post("/", async (req, res) => {
  const { subject_id, name, level, hod } = req.body;

  try {
    const response = await subjectCrud.postSubject(
      subject_id,
      name,
      level,
      hod
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all subjects
subjectRouter.get("/", async (req, res) => {
  try {
    const results = await subjectCrud.getSubjects();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get subject by ID
subjectRouter.get("/:subject_id", async (req, res) => {
  const { subject_id } = req.params;

  try {
    const results = await subjectCrud.getSubjectById(subject_id);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "Subject not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update subject by ID
subjectRouter.put("/:subject_id", async (req, res) => {
  const { subject_id } = req.params;
  const updatedValues = req.body;

  try {
    const response = await subjectCrud.updateSubject(subject_id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete subject by ID
subjectRouter.delete("/:subject_id", async (req, res) => {
  const { subject_id } = req.params;

  try {
    const response = await subjectCrud.deleteSubject(subject_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = subjectRouter;

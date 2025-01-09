const express = require("express");
const academicResultsCrud = require("../cruds/academic_results"); // Update the path as necessary
const academicResultsRouter = express.Router();

// Create a new academic result
academicResultsRouter.post("/", async (req, res) => {
  const { application_number, exam_board, subject, grade, date, school_id, sync_id, sync_status, status } = req.body;

  try {
    const response = await academicResultsCrud.postResult(
      application_number,
      exam_board,
      subject,
      grade,
      date,
      school_id,
      sync_id,
      sync_status,
      status // This will include the status
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all academic results
academicResultsRouter.get("/", async (req, res) => {
  try {
    const results = await academicResultsCrud.getResults();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get result by application number
academicResultsRouter.get("/:application_number", async (req, res) => {
  const { application_number } = req.params;

  try {
    const results = await academicResultsCrud.getResultByApplicationNumber(application_number);
    res.status(200).json(results[0]);
  } catch (err) {
    if (err.message === "No result found with that application number") {
      return res.status(404).json({ status: "404", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update result by RID
academicResultsRouter.put("/:RID", async (req, res) => {
  const { RID } = req.params;
  const updatedValues = req.body;

  try {
    const response = await academicResultsCrud.updateResult(RID, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete result by RID
academicResultsRouter.delete("/:RID", async (req, res) => {
  const { RID } = req.params;

  try {
    const response = await academicResultsCrud.deleteResult(RID);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = academicResultsRouter;
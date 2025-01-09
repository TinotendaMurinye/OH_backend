const express = require("express");
const fetchCrud = require("../cruds/fetchCrud");
const fetchRouter = express.Router();

// Get all pending academic results for a specific school
fetchRouter.get("/academic-results/:school_id/Pending", async (req, res) => {
  const { school_id } = req.params;

  try {
    const results = await fetchCrud.getPendingAcademicResults(school_id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all pending attachments for a specific school
fetchRouter.get("/attachments/:school_id/Pending", async (req, res) => {
  const { school_id } = req.params;

  try {
    const results = await fetchCrud.getPendingAttachments(school_id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all pending notifications for a specific school
fetchRouter.get("/notifications/:school_id/Pending", async (req, res) => {
  const { school_id } = req.params;

  try {
    const results = await fetchCrud.getPendingNotifications(school_id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all pending applications for a specific school
fetchRouter.get("/applications/:school_id/Pending", async (req, res) => {
  const { school_id } = req.params;

  try {
    const results = await fetchCrud.getPendingApplications(school_id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = fetchRouter;
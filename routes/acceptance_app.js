const express = require("express");
const acceptanceAppCrud = require("../cruds/acceptance_app"); // Update the path as necessary
const acceptanceAppRouter = express.Router();

// Create a new acceptance application
acceptanceAppRouter.post("/", async (req, res) => {
  const { school_id, class: classId, registration, start_date, invoice_id, Material_list, application_number } = req.body;

  try {
    const response = await acceptanceAppCrud.postAcceptanceApp(
      school_id,
      classId,
      registration,
      start_date,
      invoice_id,
      Material_list,
      application_number // Add application_number here
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all acceptance applications
acceptanceAppRouter.get("/", async (req, res) => {
  try {
    const results = await acceptanceAppCrud.getAcceptanceApps();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get acceptance application by ID
acceptanceAppRouter.get("/:AAID", async (req, res) => {
  const { AAID } = req.params;

  try {
    const results = await acceptanceAppCrud.getAcceptanceAppById(AAID);
    if (results.length === 0) {
      return res.status(404).json({ status: "404", message: "Acceptance application not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update acceptance application by ID
acceptanceAppRouter.put("/:AAID", async (req, res) => {
  const { AAID } = req.params;
  const updatedValues = req.body;

  try {
    const response = await acceptanceAppCrud.updateAcceptanceApp(AAID, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete acceptance application by ID
acceptanceAppRouter.delete("/:AAID", async (req, res) => {
  const { AAID } = req.params;

  try {
    const response = await acceptanceAppCrud.deleteAcceptanceApp(AAID);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = acceptanceAppRouter;
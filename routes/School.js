const express = require("express");
const schoolCrud = require("../cruds/School"); // Update the path as necessary
const schoolRouter = express.Router();

// Create a new school
schoolRouter.post("/", async (req, res) => {
  const { school_id, school_name, sub_pack, sub_id, account_size, sync } = req.body;

  try {
    const response = await schoolCrud.postSchool(
      school_id,
      school_name,
      sub_pack,
      sub_id,
      account_size,
      sync
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all schools
schoolRouter.get("/", async (req, res) => {
  try {
    const results = await schoolCrud.getSchools();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get school by ID
schoolRouter.get("/:school_id", async (req, res) => {
  const { school_id } = req.params;

  try {
    const results = await schoolCrud.getSchoolById(school_id);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "School not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update school by ID
schoolRouter.put("/:school_id", async (req, res) => {
  const { school_id } = req.params;
  const updatedValues = req.body;

  try {
    const response = await schoolCrud.updateSchool(school_id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete school by ID
schoolRouter.delete("/:school_id", async (req, res) => {
  const { school_id } = req.params;

  try {
    const response = await schoolCrud.deleteSchool(school_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = schoolRouter;
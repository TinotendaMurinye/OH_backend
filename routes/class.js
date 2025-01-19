const express = require("express");
const classCrud = require("../cruds/class"); // Update the path as necessary
const classRouter = express.Router();

// Create a new class
classRouter.post("/", async (req, res) => {
  const { class_id, name, teacher_id, teacher_name } = req.body;

  try {
    const response = await classCrud.postClass(
      class_id,
      name,
      teacher_id,
      teacher_name
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all classes
classRouter.get("/", async (req, res) => {
  try {
    const results = await classCrud.getClasses();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get class by ID
classRouter.get("/:class_id", async (req, res) => {
  const { class_id } = req.params;

  try {
    const results = await classCrud.getClassById(class_id);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "Class not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update class by ID
classRouter.patch("/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const updatedValues = req.body;

  try {
    const response = await classCrud.updateClass(class_id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete class by ID
classRouter.delete("/:class_id", async (req, res) => {
  const { class_id } = req.params;

  try {
    const response = await classCrud.deleteClass(class_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = classRouter;

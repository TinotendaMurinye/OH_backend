// src/routes/subPackages.js
const express = require("express");
const subPackageCrud = require("../cruds/subPackages"); // Update the path as necessary
const subPackageRouter = express.Router();

// Create a new subscription package
subPackageRouter.post("/", async (req, res) => {
  const { sub_id, subscription, price, duration } = req.body;

  try {
    const response = await subPackageCrud.postSubPackage(
      sub_id,
      subscription,
      price,
      duration
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all subscription packages
subPackageRouter.get("/", async (req, res) => {
  try {
    const results = await subPackageCrud.getSubPackages();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get subscription package by ID
subPackageRouter.get("/:sub_id", async (req, res) => {
  const { sub_id } = req.params;

  try {
    const results = await subPackageCrud.getSubPackageById(sub_id);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "Subscription package not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update subscription package by ID
subPackageRouter.put("/:sub_id", async (req, res) => {
  const { sub_id } = req.params;
  const updatedValues = req.body;

  try {
    const response = await subPackageCrud.updateSubPackage(sub_id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete subscription package by ID
subPackageRouter.delete("/:sub_id", async (req, res) => {
  const { sub_id } = req.params;

  try {
    const response = await subPackageCrud.deleteSubPackage(sub_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = subPackageRouter;
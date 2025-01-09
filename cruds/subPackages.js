// src/cruds/subPackages.js
require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let subPackageCrud = {};

// Create a new subscription package
subPackageCrud.postSubPackage = async (sub_id, subscription, price, duration) => {
  const query = `
    INSERT INTO Sub_packages (sub_id, subscription, price, duration) 
    VALUES (?, ?, ?, ?)`;

  const values = [sub_id, subscription, price, duration];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Subscription package saved successfully",
    sub_id: result.insertId,
  };
};

// Get all subscription packages
subPackageCrud.getSubPackages = async () => {
  const [results] = await pool.execute("SELECT * FROM Sub_packages");
  return results;
};

// Get subscription package by ID
subPackageCrud.getSubPackageById = async (sub_id) => {
  const [results] = await pool.execute(
    "SELECT * FROM Sub_packages WHERE sub_id = ?",
    [sub_id]
  );
  return results;
};

// Update subscription package by ID
subPackageCrud.updateSubPackage = async (sub_id, updatedValues) => {
  const fieldsToUpdate = {};

  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate[key] = updatedValues[key] === null ? null : updatedValues[key]; // Handle explicit null
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fieldsToUpdate), sub_id];

  const query = `UPDATE Sub_packages SET ${setExpressions} WHERE sub_id = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Subscription package updated successfully",
  };
};

// Delete subscription package by ID
subPackageCrud.deleteSubPackage = async (sub_id) => {
  const [result] = await pool.execute(
    "DELETE FROM Sub_packages WHERE sub_id = ?",
    [sub_id]
  );
  return {
    status: "200",
    message: "Subscription package deleted successfully",
  };
};

module.exports = subPackageCrud;
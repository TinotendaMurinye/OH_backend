require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let acceptanceAppCrud = {};

acceptanceAppCrud.postAcceptanceApp = async (school_id, classId, registration, start_date, invoice_id, Material_list, application_number) => {
  const query = `
    INSERT INTO Acceptance_App (school_id, class, registration, start_date, invoice_id, Material_list, application_number) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`; // Updated query

  const values = [school_id, classId, registration, start_date, invoice_id, Material_list, application_number]; // Updated values array

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Acceptance application saved successfully",
    AAID: result.insertId,
  };
};

// Get all acceptance applications
acceptanceAppCrud.getAcceptanceApps = async () => {
  const [results] = await pool.execute("SELECT * FROM Acceptance_App");
  return results;
};

// Get acceptance application by ID
acceptanceAppCrud.getAcceptanceAppById = async (AAID) => {
  const [results] = await pool.execute(
    "SELECT * FROM Acceptance_App WHERE AAID = ?",
    [AAID]
  );
  return results;
};

// Update acceptance application by ID
acceptanceAppCrud.updateAcceptanceApp = async (AAID, updatedValues) => {
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

  const values = [...Object.values(fieldsToUpdate), AAID];

  const query = `UPDATE Acceptance_App SET ${setExpressions} WHERE AAID = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Acceptance application updated successfully",
  };
};

// Delete acceptance application by ID
acceptanceAppCrud.deleteAcceptanceApp = async (AAID) => {
  const [result] = await pool.execute(
    "DELETE FROM Acceptance_App WHERE AAID = ?",
    [AAID]
  );
  return {
    status: "200",
    message: "Acceptance application deleted successfully",
  };
};

module.exports = acceptanceAppCrud;
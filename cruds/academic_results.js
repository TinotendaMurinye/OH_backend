require("dotenv").config();
const pool = require("../poolfile"); // Ensure correct path to your pool file

let academicResultsCrud = {};

// Create a new academic result
academicResultsCrud.postResult = async (application_number, exam_board, subject, grade, date, school_id, sync_id, sync_status, status = 'Pending') => {
  const query = `
    INSERT INTO academic_results (application_number, exam_board, subject, grade, date, status, school_id, sync_id, sync_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [application_number, exam_board, subject, grade, date, status, school_id, sync_id, sync_status];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Result saved successfully",
    result_id: result.insertId,
  };
};

// Get all academic results
academicResultsCrud.getResults = async () => {
  const [results] = await pool.execute("SELECT * FROM academic_results");
  return results;
};

// Get result by application number
academicResultsCrud.getResultByApplicationNumber = async (application_number) => {
  const [results] = await pool.execute(
    "SELECT * FROM academic_results WHERE application_number = ?",
    [application_number]
  );
  if (results.length === 0) {
    throw new Error("No result found with that application number");
  }
  return results;
};

// Update result by RID (Unique identifier)
academicResultsCrud.updateResult = async (RID, updatedValues) => {
  const fieldsToUpdate = [];

  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate.push(`${key} = ?`);
    }
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = fieldsToUpdate.join(", ");
  const values = [...Object.values(updatedValues), RID];

  const query = `UPDATE academic_results SET ${setExpressions} WHERE RID = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Result updated successfully",
  };
};

// Delete result by RID
academicResultsCrud.deleteResult = async (RID) => {
  const [result] = await pool.execute(
    "DELETE FROM academic_results WHERE RID = ?",
    [RID]
  );

  if (result.affectedRows === 0) {
    throw new Error("No result found with that RID");
  }

  return {
    status: "200",
    message: "Result deleted successfully",
  };
};

module.exports = academicResultsCrud;
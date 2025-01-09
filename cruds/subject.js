require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let subjectCrud = {};

// Create a new subject
subjectCrud.postSubject = async (subject_id, name, level, hod) => {
  const query = `
    INSERT INTO subject (subject_id, name, level, hod) 
    VALUES (?, ?, ?, ?)`;

  const values = [subject_id, name, level, hod];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Subject saved successfully",
    subject_id: result.insertId,
  };
};

// Get all subjects
subjectCrud.getSubjects = async () => {
  const [results] = await pool.execute("SELECT * FROM subject");
  return results;
};

// Get subject by ID
subjectCrud.getSubjectById = async (subject_id) => {
  const [results] = await pool.execute(
    "SELECT * FROM subject WHERE subject_id = ?",
    [subject_id]
  );
  return results;
};

// Update subject by ID
subjectCrud.updateSubject = async (subject_id, updatedValues) => {
  const fieldsToUpdate = {};

  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate[key] =
        updatedValues[key] === null ? null : updatedValues[key]; // Handle explicit null
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fieldsToUpdate), subject_id];

  const query = `UPDATE subject SET ${setExpressions} WHERE subject_id = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Subject updated successfully",
  };
};

// Delete subject by ID
subjectCrud.deleteSubject = async (subject_id) => {
  const [result] = await pool.execute(
    "DELETE FROM subject WHERE subject_id = ?",
    [subject_id]
  );
  return {
    status: "200",
    message: "Subject deleted successfully",
  };
};

module.exports = subjectCrud;

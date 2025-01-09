require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let schoolCrud = {};

// Create a new school
schoolCrud.postSchool = async (school_id, school_name, sub_pack, sub_id, account_size, sync) => {
  const query = `
    INSERT INTO School (school_id, school_name, sub_pack, sub_id, account_size, sync) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [school_id, school_name, sub_pack, sub_id, account_size, sync];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "School saved successfully",
    school_id: result.insertId,
  };
};

// Get all schools
schoolCrud.getSchools = async () => {
  const [results] = await pool.execute("SELECT * FROM School");
  return results;
};

// Get school by ID
schoolCrud.getSchoolById = async (school_id) => {
  const [results] = await pool.execute(
    "SELECT * FROM School WHERE school_id = ?",
    [school_id]
  );
  return results;
};

// Update school by ID
schoolCrud.updateSchool = async (school_id, updatedValues) => {
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

  const values = [...Object.values(fieldsToUpdate), school_id];

  const query = `UPDATE School SET ${setExpressions} WHERE school_id = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "School updated successfully",
  };
};

// Delete school by ID
schoolCrud.deleteSchool = async (school_id) => {
  const [result] = await pool.execute(
    "DELETE FROM School WHERE school_id = ?",
    [school_id]
  );
  return {
    status: "200",
    message: "School deleted successfully",
  };
};

module.exports = schoolCrud;
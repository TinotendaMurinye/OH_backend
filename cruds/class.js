require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let classCrud = {};

// Create a new class
classCrud.postClass = async (class_id, name, teacher_id, teacher_name) => {
  const query = `
    INSERT INTO class (class_id, name, teacher_id, teacher_name) 
    VALUES (?, ?, ?, ?)`;

  const values = [class_id, name, teacher_id, teacher_name];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Class saved successfully",
    class_id: result.insertId,
  };
};

// Get all classes
classCrud.getClasses = async () => {
  const [results] = await pool.execute("SELECT * FROM class");
  return results;
};

// Get class by ID
classCrud.getClassById = async (class_id) => {
  const [results] = await pool.execute(
    "SELECT * FROM class WHERE class_id = ?",
    [class_id]
  );
  return results;
};

// Update class by ID
classCrud.updateClass = async (class_id, updatedValues) => {
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

  const values = [...Object.values(fieldsToUpdate), class_id];

  const query = `UPDATE class SET ${setExpressions} WHERE class_id = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Class updated successfully",
  };
};

// Delete class by ID
classCrud.deleteClass = async (class_id) => {
  const [result] = await pool.execute(
    "DELETE FROM class WHERE class_id = ?",
    [class_id]
  );
  return {
    status: "200",
    message: "Class deleted successfully",
  };
};

module.exports = classCrud;
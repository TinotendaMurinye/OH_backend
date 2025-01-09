require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let studentCrud = {};

// Create a new student
studentCrud.postStudent = async (
  Reg_number,
  name,
  surame,
  id_number,
  dob,
  sex,
  class_,
  registration,
  phone,
  address,
  medical_aid,
  special_needs,
  allergies,
  days_attended,
  profile,
  guardian_id
) => {
  const query = `
    INSERT INTO student (
      Reg_number, name, surame, id_number, dob, sex, class, registration, 
      phone, address, medical_aid, special_needs, allergies, days_attended, 
      profile, guardian_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    Reg_number,
    name,
    surame,
    id_number,
    dob,
    sex,
    class_,
    registration,
    phone,
    address,
    medical_aid,
    special_needs,
    allergies,
    days_attended,
    profile,
    guardian_id,
  ];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Student saved successfully",
    student_id: result.insertId,
  };
};

// Get all students
studentCrud.getStudents = async () => {
  const [results] = await pool.execute("SELECT * FROM student");
  return results;
};

// Get student by registration number
studentCrud.getStudentByRegNumber = async (Reg_number) => {
  const [results] = await pool.execute(
    "SELECT * FROM student WHERE Reg_number = ?",
    [Reg_number]
  );
  return results;
};

// Update student by registration number
studentCrud.updateStudent = async (Reg_number, updatedValues) => {
  // Prepare an object to hold only defined values
  const fieldsToUpdate = {};

  // Check each property in updatedValues
  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate[key] = updatedValues[key] === null ? null : updatedValues[key]; // Handle explicit null
    }
  }

  // Ensure that there are fields to update
  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fieldsToUpdate), Reg_number]; // Add Reg_number at the end for WHERE clause

  const query = `UPDATE student SET ${setExpressions} WHERE Reg_number = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Student updated successfully",
  };
};

// Delete student by registration number
studentCrud.deleteStudent = async (Reg_number) => {
  const [result] = await pool.execute(
    "DELETE FROM student WHERE Reg_number = ?",
    [Reg_number]
  );
  return {
    status: "200",
    message: "Student deleted successfully",
  };
};

module.exports = studentCrud;
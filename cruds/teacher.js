require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let teacherCrud = {};

// Create a new teacher
teacherCrud.postTeacher = async (
  teacher_id,
  name,
  surname,
  id_number,
  dob,
  sex,
  registration,
  phone1,
  phone2,
  address,
  subject,
  qualification,
  date_hired,
  comment,
  rating,
  attendance
) => {
  const query = `
    INSERT INTO teacher (
      teacher_id, name, surname, id_number, dob, sex, registration, 
      phone1, phone2, address, subject, qualification, date_hired, 
      comment, rating, attendance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    teacher_id,
    name,
    surname,
    id_number,
    dob,
    sex,
    registration,
    phone1,
    phone2,
    address,
    subject,
    qualification,
    date_hired,
    comment,
    rating,
    attendance,
  ];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Teacher saved successfully",
    teacher_id: result.insertId,
  };
};

// Get all teachers
teacherCrud.getTeachers = async () => {
  const [results] = await pool.execute("SELECT * FROM teacher");
  return results;
};

// Get teacher by ID
teacherCrud.getTeacherById = async (teacher_id) => {
  const [results] = await pool.execute(
    "SELECT * FROM teacher WHERE teacher_id = ?",
    [teacher_id]
  );
  return results;
};

// Update teacher by ID
teacherCrud.updateTeacher = async (teacher_id, updatedValues) => {
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

  const values = [...Object.values(fieldsToUpdate), teacher_id];

  const query = `UPDATE teacher SET ${setExpressions} WHERE teacher_id = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Teacher updated successfully",
  };
};

// Delete teacher by ID
teacherCrud.deleteTeacher = async (teacher_id) => {
  const [result] = await pool.execute(
    "DELETE FROM teacher WHERE teacher_id = ?",
    [teacher_id]
  );
  return {
    status: "200",
    message: "Teacher deleted successfully",
  };
};

module.exports = teacherCrud;
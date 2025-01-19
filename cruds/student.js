require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let studentCrud = {};

// Function to generate a unique student ID
const generateStudentId = async () => {
  const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
  const yearPrefix = `Reg-${String(currentYear).padStart(2, '0')}`; // Format to Reg-YY

  // Count the number of students registered in the current year
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS count FROM student WHERE Reg_number LIKE ?`,
    [`${yearPrefix}%`] // Matches all Reg_numbers that start with Reg-YY
  );

  const currentCount = rows[0].count; // Get the count from the result

  // Determine the next number
  const nextNumber = currentCount; // This will be the next number in the sequence

  // Format the number to be six digits
  const formattedNumber = String(nextNumber + 1).padStart(6, '0'); // Increment by 1

  // Combine to form the full ID
  const studentId = `${yearPrefix}-${formattedNumber}`;
  return studentId;
};
// Create a new student
studentCrud.postStudent = async (
  name,
  surname, // Ensure this matches the correct column name
  id_number,
  dob,
  sex,
  studentClass,
  registration,
  phone,
  address,
  medical_aid,
  special_needs,
  allergies,
  days_attended,
  profile,
  guardian_id,
  school_id,
  sync_status,
  sync_id
) => {
  const Reg_number = await generateStudentId(); // Generate unique student ID

  const values = [
    Reg_number,
    name,
    surname, // Update this if necessary
    id_number,
    dob,
    sex,
    studentClass,
    registration,
    phone !== undefined ? phone : null,
    address,
    medical_aid || null,
    special_needs || null,
    allergies || null,
    days_attended !== undefined ? days_attended : null,
    profile || null,
    guardian_id,
    school_id !== undefined ? school_id : null,
    sync_status || null,
    sync_id !== undefined ? sync_id : null,
  ];

  const query = `
    INSERT INTO student (
      Reg_number, name, surname, id_number, dob, sex, class, registration, 
      phone, address, medical_aid, special_needs, allergies, days_attended, 
      profile, guardian_id, school_id, sync_status, sync_id
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await pool.execute(query, values);
    return {
      status: "200",
      message: "Student saved successfully",
      student_id: Reg_number,
    };
  } catch (error) {
    console.error("Error inserting student:", JSON.stringify(error, null, 2));
    throw new Error("Failed to save student");
  }
};

// Get all students
studentCrud.getStudents = async () => {
  try {
    const [results] = await pool.execute("SELECT * FROM student");
    return results;
  } catch (error) {
    console.error("Error fetching students:", JSON.stringify(error, null, 2));
    throw new Error("Failed to fetch students");
  }
};

// Get student by registration number
studentCrud.getStudentByRegNumber = async (Reg_number) => {
  try {
    const [results] = await pool.execute(
      "SELECT * FROM student WHERE Reg_number = ?",
      [Reg_number]
    );
    return results;
  } catch (error) {
    console.error("Error fetching student:", JSON.stringify(error, null, 2));
    throw new Error("Failed to fetch student");
  }
};
studentCrud.getStudentsByClass = async (class_name) => {
  try {
    const [results] = await pool.execute(
      "SELECT * FROM student WHERE class = ?",
      [class_name]
    );
    return results;
  } catch (error) {
    console.error("Error fetching student:", JSON.stringify(error, null, 2));
    throw new Error("Failed to fetch student");
  }
};

// Update student by registration number
studentCrud.updateStudent = async (Reg_number, updatedValues) => {
  const fieldsToUpdate = {};

  // Check each property in updatedValues
  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate[key] = updatedValues[key] === null ? null : updatedValues[key];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fieldsToUpdate), Reg_number];

  const query = `UPDATE student SET ${setExpressions} WHERE Reg_number = ?`;

  try {
    const [result] = await pool.execute(query, values);
    return {
      status: "200",
      message: "Student updated successfully",
    };
  } catch (error) {
    console.error("Error updating student:", JSON.stringify(error, null, 2));
    throw new Error("Failed to update student");
  }
};

// Delete student by registration number
studentCrud.deleteStudent = async (Reg_number) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM student WHERE Reg_number = ?",
      [Reg_number]
    );
    return {
      status: "200",
      message: "Student deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting student:", JSON.stringify(error, null, 2));
    throw new Error("Failed to delete student");
  }
};

module.exports = studentCrud;
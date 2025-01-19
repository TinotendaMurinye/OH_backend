const express = require("express");
const studentCrud = require("../cruds/student"); // Ensure the path is correct
const studentRouter = express.Router();

studentRouter.post("/", async (req, res) => {
  const {
    name,
    surname,
    id_number,
    dob,
    sex,
    class: studentClass,
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
    sync_id,
  } = req.body;

  // Validate required fields
  if (!name || !surname || !dob || !sex || !guardian_id || !school_id) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }

  try {
   

    const response = await studentCrud.postStudent(
      name,
      surname,
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
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred while creating student:", err);
    res.status(500).json({ status: "500", message: "Failed to create student" });
  }
});
// Get all students
studentRouter.get("/", async (req, res) => {
  try {
    const results = await studentCrud.getStudents();
    res.status(200).json(results);
  } catch (err) {
    console.error("Error occurred while fetching students:", err);
    res.status(500).json({ status: "500", message: "Failed to fetch students" });
  }
});

// Get a student by registration number
studentRouter.get("/:Reg_number", async (req, res) => {
  const { Reg_number } = req.params;

  try {
    const results = await studentCrud.getStudentByRegNumber(Reg_number);
    if (results.length === 0) {
      return res.status(404).json({ status: "404", message: "Student not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error occurred while fetching student:", err);
    res.status(500).json({ status: "500", message: "Failed to fetch student" });
  }
});

studentRouter.get("/class/:class_name", async (req, res) => {
  const { class_name } = req.params;

  try {
    const results = await studentCrud.getStudentsByClass(class_name);
    if (results.length === 0) {
      return res.status(404).json({ status: "404", message: "Student not found" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Error occurred while fetching students:", err);
    res.status(500).json({ status: "500", message: "Failed to fetch students" });
  }
});

// Update a student by registration number
studentRouter.put("/:Reg_number", async (req, res) => {
  const { Reg_number } = req.params;
  const updatedValues = req.body;

  try {
    const response = await studentCrud.updateStudent(Reg_number, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error occurred while updating student:", err);
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: "Failed to update student" });
  }
});

// Delete a student by registration number
studentRouter.delete("/:Reg_number", async (req, res) => {
  const { Reg_number } = req.params;

  try {
    const response = await studentCrud.deleteStudent(Reg_number);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error occurred while deleting student:", err);
    res.status(500).json({ status: "500", message: "Failed to delete student" });
  }
});

module.exports = studentRouter; // Ensure you export the router
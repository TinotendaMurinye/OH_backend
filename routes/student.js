const express = require("express");
const studentCrud = require("../cruds/student"); // Update the path as necessary
const studentRouter = express.Router();

// Create a new student
studentRouter.post("/", async (req, res) => {
  const {
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
  } = req.body;

  try {
    const response = await studentCrud.postStudent(
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
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err); // Logging the error
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all students
studentRouter.get("/", async (req, res) => {
  try {
    const results = await studentCrud.getStudents();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get student by registration number
studentRouter.get("/:Reg_number", async (req, res) => {
  const { Reg_number } = req.params;

  try {
    const results = await studentCrud.getStudentByRegNumber(Reg_number);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "Student not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update student by registration number
studentRouter.put("/:Reg_number", async (req, res) => {
  const { Reg_number } = req.params;
  const updatedValues = req.body;

  try {
    const response = await studentCrud.updateStudent(Reg_number, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete student by registration number
studentRouter.delete("/:Reg_number", async (req, res) => {
  const { Reg_number } = req.params;

  try {
    const response = await studentCrud.deleteStudent(Reg_number);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = studentRouter; // Ensure the export matches the router variable name

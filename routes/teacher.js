const express = require("express");
const teacherCrud = require("../cruds/teacher"); // Update the path as necessary
const teacherRouter = express.Router();

// Create a new teacher
teacherRouter.post("/", async (req, res) => {
  const {
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
  } = req.body;

  try {
    const response = await teacherCrud.postTeacher(
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
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all teachers
teacherRouter.get("/", async (req, res) => {
  try {
    const results = await teacherCrud.getTeachers();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get teacher by ID
teacherRouter.get("/:teacher_id", async (req, res) => {
  const { teacher_id } = req.params;

  try {
    const results = await teacherCrud.getTeacherById(teacher_id);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "Teacher not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update teacher by ID
teacherRouter.put("/:teacher_id", async (req, res) => {
  const { teacher_id } = req.params;
  const updatedValues = req.body;

  try {
    const response = await teacherCrud.updateTeacher(teacher_id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete teacher by ID
teacherRouter.delete("/:teacher_id", async (req, res) => {
  const { teacher_id } = req.params;

  try {
    const response = await teacherCrud.deleteTeacher(teacher_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = teacherRouter;

const express = require("express");
const applicationCrud = require("../cruds/applications"); // Update the path as necessary
const applicationRouter = express.Router();

applicationRouter.post("/", async (req, res) => {
  const {
    user_id,
    student_name,
    student_middlename,
    student_surname,
    id_number,
    sex,
    dob,
    class_name,
    registration,
    phone,
    email,
    address,
    name_of_parent,
    phone_of_parent,
    relationship_to_student,
    nationality,
    language,
    status,
    school_name,
    school_id,
    sync_id,
    sync_status,
    date,
  } = req.body;

  try {
    const response = await applicationCrud.postApplication(
      user_id,
      student_name,
      student_middlename,
      student_surname,
      id_number,
      sex,
      dob,
      class_name,
      registration,
      phone,
      email,
      address,
      name_of_parent,
      phone_of_parent,
      relationship_to_student,
      nationality,
      language,
      status,
      school_name,
      school_id,
      sync_id,
      sync_status,
      date
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

applicationRouter.get("/:application_number", async (req, res) => {
  const { application_number } = req.params;
  try {
    const application = await applicationCrud.getApplicationByNumber(application_number);
    if (application) {
      res.status(200).json(application);
    } else {
      res.status(404).json({ status: "404", message: "Application not found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all applications
applicationRouter.get("/", async (req, res) => {
  try {
    const applications = await applicationCrud.getAllApplications();
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete application by application number
applicationRouter.delete("/:application_number", async (req, res) => {
  const { application_number } = req.params;
  try {
    const isDeleted = await applicationCrud.deleteApplicationByNumber(application_number);
    if (isDeleted) {
      res.status(200).json({ status: "200", message: "Application deleted successfully" });
    } else {
      res.status(404).json({ status: "404", message: "Application not found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get applications by user ID
applicationRouter.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const applications = await applicationCrud.getApplicationsByUserId(user_id);
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get applications by school ID
applicationRouter.get("/school/:school_id", async (req, res) => {
  const { school_id } = req.params;
  try {
    const applications = await applicationCrud.getApplicationsBySchoolId(school_id);
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get applications by status
applicationRouter.get("/status/:status", async (req, res) => {
  const { status } = req.params;
  try {
    const applications = await applicationCrud.getApplicationsByStatus(status);
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update application by application number
applicationRouter.patch("/:application_number", async (req, res) => {
  const { application_number } = req.params;
  const updates = req.body; // Expecting a JSON object with the fields to update
  try {
    const isUpdated = await applicationCrud.updateApplicationByNumber(application_number, updates);
    if (isUpdated) {
      res.status(200).json({ status: "200", message: "Application updated successfully" });
    } else {
      res.status(404).json({ status: "404", message: "Application not found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get application details
applicationRouter.get("/details/:application_number", async (req, res) => {
  const { application_number } = req.params;
  try {
    const applicationDetails = await applicationCrud.getApplicationDetailsByNumber(application_number);
    if (applicationDetails) {
      res.status(200).json(applicationDetails);
    } else {
      res.status(404).json({ status: "404", message: "Application details not found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update application status to approved
applicationRouter.patch("/accepted/:application_number", async (req, res) => {
  const { application_number } = req.params;
  try {
    const isApproved = await applicationCrud.approveApplicationByNumber(application_number);
    if (isApproved) {
      res.status(200).json({ status: "200", message: "Application approved successfully" });
    } else {
      res.status(404).json({ status: "404", message: "Application not found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update application status to rejected
applicationRouter.patch("/reject/:application_number", async (req, res) => {
  const { application_number } = req.params;
  try {
    const isRejected = await applicationCrud.rejectApplicationByNumber(application_number);
    if (isRejected) {
      res.status(200).json({ status: "200", message: "Application rejected successfully" });
    } else {
      res.status(404).json({ status: "404", message: "Application not found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// New route to get joined application data
applicationRouter.get("/joined/:application_number", async (req, res) => {
  const { application_number } = req.params;
  try {
    const joinedData = await applicationCrud.getJoinedApplicationData(application_number);
    if (joinedData.length > 0) {
      res.status(200).json(joinedData);
    } else {
      res.status(404).json({ status: "404", message: "Joined data not found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = applicationRouter;
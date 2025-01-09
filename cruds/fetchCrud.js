require("dotenv").config();
const pool = require("../poolfile");

let fetchCrud = {};

// Get all pending academic results for a specific school
fetchCrud.getPendingAcademicResults = async (school_id) => {
  const query = `
    SELECT * FROM academic_results 
    WHERE school_id = ? AND sync_status = 'Pending'`;
  
  const [results] = await pool.execute(query, [school_id]);
  return results;
};

// Get all pending attachments for a specific school
fetchCrud.getPendingAttachments = async (school_id) => {
  const query = `
    SELECT * FROM attachments 
    WHERE school_id = ? AND sync_status = 'Pending'`;
  
  const [results] = await pool.execute(query, [school_id]);
  return results;
};

// Get all pending notifications for a specific school
fetchCrud.getPendingNotifications = async (school_id) => {
  const query = `
    SELECT * FROM notifications 
    WHERE school_id = ? AND sync_status = 'Pending'`;
  
  const [results] = await pool.execute(query, [school_id]);
  return results;
};

// Get all pending applications for a specific school
fetchCrud.getPendingApplications = async (school_id) => {
  const query = `
    SELECT * FROM applications 
    WHERE school_id = ? AND sync_status = 'Pending'`;
  
  const [results] = await pool.execute(query, [school_id]);
  return results;
};

module.exports = fetchCrud;
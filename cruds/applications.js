require("dotenv").config();
const pool = require("../poolfile");

const applicationCrud = {};

applicationCrud.postApplication = async (
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
) => {
  // Step 1: Retrieve the last application number
  const lastQuery = `SELECT application_number FROM applications ORDER BY application_number DESC LIMIT 1`;
  const [lastResult] = await pool.execute(lastQuery);
  
  let newApplicationNumber;
  
  if (lastResult.length > 0) {
    // Step 2: Extract the last number and increment it
    const lastApplicationNumber = lastResult[0].application_number;
    const lastNumber = parseInt(lastApplicationNumber.slice(1)); // Remove 'A' and parse to integer
    const newNumber = lastNumber + 1;
    
    // Step 3: Format the new application number
    newApplicationNumber = `A${String(newNumber).padStart(9, '0')}`; // Pad with zeros
  } else {
    // If no applications exist, start with A000000001
    newApplicationNumber = 'A000000001';
  }

  // Step 4: Prepare the insert query
  const query = `
    INSERT INTO applications (
      application_number, user_id, student_name, student_middlename, 
      student_surname, id_number, sex, dob, class_name, registration, 
      phone, email, address, name_of_parent, phone_of_parent, 
      relationship_to_student, nationality, language, 
      status, school_name, school_id, sync_id, 
      sync_status, date
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    newApplicationNumber,
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
    school_id,
    school_name,
    sync_id,
    sync_status,
    date,
  ];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Application saved successfully",
    application_number: newApplicationNumber,
  };
};
applicationCrud.getApplicationByNumber = async (application_number) => {
  const query = `SELECT * FROM applications WHERE application_number = ?`;
  const values = [application_number];
  const [result] = await pool.execute(query, values);
  return result[0]; // Return the first matching record
};

// Get all applications
applicationCrud.getAllApplications = async () => {
  const query = `SELECT * FROM applications`;
  const [results] = await pool.execute(query);
  return results;
};

// Delete application by application number
applicationCrud.deleteApplicationByNumber = async (application_number) => {
  const query = `DELETE FROM applications WHERE application_number = ?`;
  const values = [application_number];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0; // Return true if a row was deleted
};

// Get applications by user ID
applicationCrud.getApplicationsByUserId = async (user_id) => {
  const query = `SELECT * FROM applications WHERE user_id = ?`;
  const values = [user_id];
  const [results] = await pool.execute(query, values);
  return results;
};

// Get applications by school ID
applicationCrud.getApplicationsBySchoolId = async (school_id) => {
  const query = `SELECT * FROM applications WHERE school_id = ?`;
  const values = [school_id];
  const [results] = await pool.execute(query, values);
  return results;
};

// Get applications by status
applicationCrud.getApplicationsByStatus = async (status) => {
  const query = `SELECT * FROM applications WHERE status = ?`;
  const values = [status];
  const [results] = await pool.execute(query, values);
  return results;
};

// Update application by application number
applicationCrud.updateApplicationByNumber = async (application_number, updates) => {
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = [...Object.values(updates), application_number];

  const query = `UPDATE applications SET ${fields} WHERE application_number = ?`;
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0; // Return true if a row was updated
};

applicationCrud.getApplicationsByStatus = async (status) => {
  const query = `SELECT * FROM applications WHERE status = ?`;
  const values = [status];
  const [results] = await pool.execute(query, values);
  return results;
};

applicationCrud.getApplicationDetailsByNumber = async (application_number) => {
  const query = `
    SELECT 
      a.*,           -- All columns from applications
      ar.*,          -- All columns from academic_results
      at.*           -- All columns from attachments
    FROM 
      applications a
    LEFT JOIN 
      academic_results ar ON a.application_number = ar.application_number
    LEFT JOIN 
      attachments at ON a.application_number = at.application_number
    WHERE 
      a.application_number = ?`;

  const values = [application_number];
  const [results] = await pool.execute(query, values);
  
  if (results.length === 0) {
    return null; // No application found
  }

  const applicationDetails = {
    application: {
      application_number: results[0].application_number,
      user_id: results[0].user_id,
      student_name: results[0].student_name,
      student_middlename: results[0].student_middlename,
      student_surname: results[0].student_surname,
      id_number: results[0].id_number,
      sex: results[0].sex,
      dob: results[0].dob,
      class_name: results[0].class_name,
      registration: results[0].registration,
      phone: results[0].phone,
      email: results[0].email,
      address: results[0].address,
      name_of_parent: results[0].name_of_parent,
      phone_of_parent: results[0].phone_of_parent,
      relationship_to_student: results[0].relationship_to_student,
      nationality: results[0].nationality,
      language: results[0].language,
      status: results[0].status,
      school_name: results[0].school_name,
      school_id: results[0].school_id,
      sync_id: results[0].sync_id,
      sync_status: results[0].sync_status,
      date: results[0].date,
    },
    academic_results: [],
    attachments: [],
  };

  // Function to deduplicate arrays based on a unique key
  const deduplicate = (array, key) => {
    const seen = new Set();
    return array.filter(item => {
      const identifier = item[key];
      if (seen.has(identifier)) {
        return false;
      }
      seen.add(identifier);
      return true;
    });
  };

  // Iterate through the results and separate academic results and attachments
  results.forEach(row => {
    if (row.RID) {
      applicationDetails.academic_results.push({
        RID: row.RID,
        exam_board: row.exam_board,
        subject: row.subject,
        grade: row.grade,
      });
    }
    if (row.AID) {
      applicationDetails.attachments.push({
        AID: row.AID,
        attachment: row.attachment,
        path: row.path,
      });
    }
  });

  // Deduplicate academic results and attachments
  applicationDetails.academic_results = deduplicate(applicationDetails.academic_results, 'RID');
  applicationDetails.attachments = deduplicate(applicationDetails.attachments, 'AID');

  return applicationDetails;
};
// Update application status to approved
applicationCrud.approveApplicationByNumber = async (application_number) => {
  const query = `UPDATE applications SET status = 'approved' WHERE application_number = ?`;
  const values = [application_number];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0; // Return true if a row was updated
};

// Update application status to rejected
applicationCrud.rejectApplicationByNumber = async (application_number) => {
  const query = `UPDATE applications SET status = 'rejected' WHERE application_number = ?`;
  const values = [application_number];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0; // Return true if a row was updated
};

module.exports = applicationCrud;
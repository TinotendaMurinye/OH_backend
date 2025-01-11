require("dotenv").config();
const pool = require("../poolfile");

const applicationCrud = {};

// Application CRUD Operations
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
  const lastQuery = `SELECT application_number FROM applications ORDER BY application_number DESC LIMIT 1`;
  const [lastResult] = await pool.execute(lastQuery);
  
  let newApplicationNumber;
  
  if (lastResult.length > 0) {
    const lastApplicationNumber = lastResult[0].application_number;
    const lastNumber = parseInt(lastApplicationNumber.slice(1));
    const newNumber = lastNumber + 1;
    newApplicationNumber = `A${String(newNumber).padStart(9, '0')}`;
  } else {
    newApplicationNumber = 'A000000001';
  }

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
  return result[0];
};

applicationCrud.getAllApplications = async () => {
  const query = `SELECT * FROM applications`;
  const [results] = await pool.execute(query);
  return results;
};

applicationCrud.deleteApplicationByNumber = async (application_number) => {
  const query = `DELETE FROM applications WHERE application_number = ?`;
  const values = [application_number];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0;
};

applicationCrud.getApplicationsByUserId = async (user_id) => {
  const query = `SELECT * FROM applications WHERE user_id = ?`;
  const values = [user_id];
  const [results] = await pool.execute(query, values);
  return results;
};

applicationCrud.getApplicationsBySchoolId = async (school_id) => {
  const query = `SELECT * FROM applications WHERE school_id = ?`;
  const values = [school_id];
  const [results] = await pool.execute(query, values);
  return results;
};

applicationCrud.getApplicationsByStatus = async (status) => {
  const query = `SELECT * FROM applications WHERE status = ?`;
  const values = [status];
  const [results] = await pool.execute(query, values);
  return results;
};

applicationCrud.updateApplicationByNumber = async (application_number, updates) => {
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = [...Object.values(updates), application_number];

  const query = `UPDATE applications SET ${fields} WHERE application_number = ?`;
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0;
};

applicationCrud.getApplicationDetailsByNumber = async (application_number) => {
  const query = `
    SELECT 
      a.*, 
      ar.*, 
      at.* 
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
    return null;
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

  applicationDetails.academic_results = deduplicate(applicationDetails.academic_results, 'RID');
  applicationDetails.attachments = deduplicate(applicationDetails.attachments, 'AID');

  return applicationDetails;
};

applicationCrud.approveApplicationByNumber = async (application_number) => {
  const query = `UPDATE applications SET status = 'approved' WHERE application_number = ?`;
  const values = [application_number];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0;
};

applicationCrud.rejectApplicationByNumber = async (application_number) => {
  const query = `UPDATE applications SET status = 'rejected' WHERE application_number = ?`;
  const values = [application_number];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0;
};

// New method to get joined data from applications, Acceptance_App, and Invoice
applicationCrud.getJoinedApplicationData = async (application_number) => {
  const query = `
    SELECT 
      a.*, 
      aa.*, 
      i.* 
    FROM 
      applications a
    JOIN 
      Acceptance_App aa ON a.application_number = aa.application_number
    JOIN 
      Invoice i ON aa.invoice_id = i.invoice_id
    WHERE 
      a.application_number = ?`;

  const values = [application_number];
  const [results] = await pool.execute(query, values);
  
  return results; // Return the joined results
};

module.exports = applicationCrud;
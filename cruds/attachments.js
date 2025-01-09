require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let attachmentsCrud = {};

attachmentsCrud.postAttachment = async (
    attachment,
    path,
    application_number,
    school_id,
    sync_status,
    sync_id
  ) => {
    const query = `
        INSERT INTO attachments (attachment, path, application_number, school_id, sync_status, sync_id) 
        VALUES (?, ?, ?, ?, ?, ?)`;
  
    const values = [
      attachment,
      path,
      application_number,
      school_id,
      sync_status,
      sync_id,
    ];
  
    const [result] = await pool.execute(query, values);
    return {
      status: "200",
      message: "Attachment saved successfully",
      AID: result.insertId, // The auto-generated AID
    };
  };
  

// Get all attachments
attachmentsCrud.getAttachments = async () => {
  const [results] = await pool.execute("SELECT * FROM attachments");
  return results;
};

// Get attachment by ID
attachmentsCrud.getAttachmentById = async (AID) => {
  const [results] = await pool.execute(
    "SELECT * FROM attachments WHERE AID = ?",
    [AID]
  );
  return results;
};

// Update attachment by ID
attachmentsCrud.updateAttachment = async (AID, updatedValues) => {
  const fieldsToUpdate = {};

  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate[key] =
        updatedValues[key] === null ? null : updatedValues[key];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fieldsToUpdate), AID];

  const query = `UPDATE attachments SET ${setExpressions} WHERE AID = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Attachment updated successfully",
  };
};

// Delete attachment by ID
attachmentsCrud.deleteAttachment = async (AID) => {
  const [result] = await pool.execute("DELETE FROM attachments WHERE AID = ?", [
    AID,
  ]);
  return {
    status: "200",
    message: "Attachment deleted successfully",
  };
};

module.exports = attachmentsCrud;

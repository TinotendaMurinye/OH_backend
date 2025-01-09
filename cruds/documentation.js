require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let documentationCrud = {};

// Create a new document
documentationCrud.postDocument = async (
  applicatio_number,
  document_type,
  status,
  uri
) => {
  const query = `
    INSERT INTO documentation (
      applicatio_number, document_type, status, uri
    ) VALUES (?, ?, ?, ?)`;

  const values = [applicatio_number, document_type, status, uri];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Document saved successfully",
    document_id: result.insertId,
  };
};

// Get all documents
documentationCrud.getDocuments = async () => {
  const [results] = await pool.execute("SELECT * FROM documentation");
  return results;
};

// Get document by ID
documentationCrud.getDocumentById = async (DID) => {
  const [results] = await pool.execute(
    "SELECT * FROM documentation WHERE DID = ?",
    [DID]
  );
  return results;
};

// Update document by ID
documentationCrud.updateDocument = async (DID, updatedValues) => {
  // Prepare an object to hold only defined values
  const fieldsToUpdate = {};

  // Check each property in updatedValues
  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate[key] = updatedValues[key] === null ? null : updatedValues[key]; // Handle explicit null
    }
  }

  // Ensure that there are fields to update
  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fieldsToUpdate), DID]; // Add DID at the end for WHERE clause

  const query = `UPDATE documentation SET ${setExpressions} WHERE DID = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Document updated successfully",
  };
};

// Delete document by ID
documentationCrud.deleteDocument = async (DID) => {
  const [result] = await pool.execute(
    "DELETE FROM documentation WHERE DID = ?",
    [DID]
  );
  return {
    status: "200",
    message: "Document deleted successfully",
  };
};

module.exports = documentationCrud;
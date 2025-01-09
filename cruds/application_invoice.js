// invoiceCrud.js
require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let invoiceCrud = {};

// Create a new invoice
// Create a new invoice
invoiceCrud.postInvoice = async (uniform_price, school_fees, boarding_fees, feeding_price, application_fee, class_id, class_name, registration) => {
    const query = `
      INSERT INTO Invoice (uniform_price, school_fees, boarding_fees, feeding_price, application_fee, class_id, class_name, registration) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
    const values = [
      uniform_price,
      school_fees,
      boarding_fees,  // Ensure null for undefined
      feeding_price,  // Ensure null for undefined
      application_fee,
      class_id,
      class_name,
      registration
    ];
  
    // Log values to check for undefined parameters
    console.log("Invoice Values:", values);
  
    const [result] = await pool.execute(query, values);
    return {
      status: "200",
      message: "Invoice saved successfully",
      invoice_id: result.insertId,
    };
  };

// Get all invoices
invoiceCrud.getInvoices = async () => {
  const [results] = await pool.execute("SELECT * FROM Invoice");
  return results;
};

// Get invoice by ID
invoiceCrud.getInvoiceById = async (invoice_id) => {
  const [results] = await pool.execute(
    "SELECT * FROM Invoice WHERE invoice_id = ?",
    [invoice_id]
  );
  return results;
};

// Update invoice by ID
invoiceCrud.updateInvoice = async (invoice_id, updatedValues) => {
  const fieldsToUpdate = {};

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

  const values = [...Object.values(fieldsToUpdate), invoice_id];

  const query = `UPDATE Invoice SET ${setExpressions} WHERE invoice_id = ?`;

  await pool.execute(query, values);
  return {
    status: "200",
    message: "Invoice updated successfully",
  };
};

// Delete invoice by ID
invoiceCrud.deleteInvoice = async (invoice_id) => {
  await pool.execute(
    "DELETE FROM Invoice WHERE invoice_id = ?",
    [invoice_id]
  );
  return {
    status: "200",
    message: "Invoice deleted successfully",
  };
};

module.exports = invoiceCrud;
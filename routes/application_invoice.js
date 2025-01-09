// invoiceRoutes.js
const express = require("express");
const invoiceCrud = require("../cruds/application_invoice"); // Adjust the path if necessary
const router = express.Router();

// Create a new invoice
router.post("/", async (req, res) => {
    console.log("Request Body:", req.body); // Log the incoming request body
    const { uniform_price, school_fees, boarding_fees, feeding_price, application_fee, class_id, class_name, registration } = req.body;
  
    // Log each individual value
    console.log("Values Received:", {
      uniform_price,
      school_fees,
      boarding_fees,
      feeding_price,
      application_fee,
      class_id,
      class_name,
      registration
      
    });
  
    try {
      const response = await invoiceCrud.postInvoice(
        uniform_price,
        school_fees,
        boarding_fees,
        feeding_price,
        application_fee,
        class_id,
        class_name,
        registration
      );
      res.status(201).json(response);
    } catch (err) {
      console.error("Error creating invoice:", err);
      res.status(500).json({ status: "500", message: err.message });
    }
  });
// Get all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await invoiceCrud.getInvoices();
    res.status(200).json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get an invoice by ID
router.get("/:id", async (req, res) => {
  const invoice_id = req.params.id;

  try {
    const invoice = await invoiceCrud.getInvoiceById(invoice_id);
    if (invoice.length > 0) {
      res.status(200).json(invoice[0]);
    } else {
      res.status(404).json({ status: "404", message: "Invoice not found" });
    }
  } catch (err) {
    console.error("Error fetching invoice:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update an invoice by ID
router.put("/:id", async (req, res) => {
  const invoice_id = req.params.id;
  const updatedValues = req.body;

  try {
    const response = await invoiceCrud.updateInvoice(invoice_id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error updating invoice:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete an invoice by ID
router.delete("/:id", async (req, res) => {
  const invoice_id = req.params.id;

  try {
    const response = await invoiceCrud.deleteInvoice(invoice_id);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error deleting invoice:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = router;
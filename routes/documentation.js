const express = require("express");
const documentationCrud = require("../cruds/documentation"); // Update the path as necessary
const documentationRouter = express.Router();

// Create a new document
documentationRouter.post("/", async (req, res) => {
  const { applicatio_number, document_type, status, uri } = req.body;

  try {
    const response = await documentationCrud.postDocument(
      applicatio_number,
      document_type,
      status,
      uri
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err); // Logging the error
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all documents
documentationRouter.get("/", async (req, res) => {
  try {
    const results = await documentationCrud.getDocuments();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get document by ID
documentationRouter.get("/:DID", async (req, res) => {
  const { DID } = req.params;

  try {
    const results = await documentationCrud.getDocumentById(DID);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "Document not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update document by ID
documentationRouter.put("/:DID", async (req, res) => {
  const { DID } = req.params;
  const updatedValues = req.body;

  try {
    const response = await documentationCrud.updateDocument(DID, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete document by ID
documentationRouter.delete("/:DID", async (req, res) => {
  const { DID } = req.params;

  try {
    const response = await documentationCrud.deleteDocument(DID);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = documentationRouter; // Ensure the export matches the router variable name
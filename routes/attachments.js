const express = require("express");
const attachmentsCrud = require("../cruds/attachments"); // Update the path as necessary
const attachmentsRouter = express.Router();

attachmentsRouter.post('/', async (req, res) => {
  const {
    attachment,
    path,
    application_number,
    school_id,
    sync_status,
    sync_id
  } = req.body;

  try {
    // Call the postAttachment method
    const result = await attachmentsCrud.postAttachment(
      attachment,
      path,
      application_number,
      school_id,
      sync_status,
      sync_id
    );

    // Send a success response
    res.status(200).json(result);
  } catch (error) {
    console.error('Error saving attachment:', error);
    res.status(500).json({ status: '500', message: 'Internal Server Error' });
  }
});

// Get all attachments
attachmentsRouter.get("/", async (req, res) => {
  try {
    const results = await attachmentsCrud.getAttachments();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get attachment by ID
attachmentsRouter.get("/:AID", async (req, res) => {
  const { AID } = req.params;

  try {
    const results = await attachmentsCrud.getAttachmentById(AID);
    if (results.length === 0) {
      return res.status(404).json({ status: "404", message: "Attachment not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update attachment by ID
attachmentsRouter.put("/:AID", async (req, res) => {
  const { AID } = req.params;
  const updatedValues = req.body;

  try {
    const response = await attachmentsCrud.updateAttachment(AID, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete attachment by ID
attachmentsRouter.delete("/:AID", async (req, res) => {
  const { AID } = req.params;

  try {
    const response = await attachmentsCrud.deleteAttachment(AID);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = attachmentsRouter;
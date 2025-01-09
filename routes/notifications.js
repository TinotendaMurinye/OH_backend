const express = require("express");
const notificationCrud = require("../cruds/notifications"); // Update the path as necessary
const notificationRouter = express.Router();

// Create a new notification
notificationRouter.post("/", async (req, res) => {
  const {
    nid,
    sender,
    reciever,
    sender_id,
    reciever_id,
    reciever_type,
    notification,
    time_sent,
    time_recieved,
    date_sent,
  } = req.body;

  try {
    const response = await notificationCrud.postNotification(
      nid,
      sender,
      reciever,
      sender_id,
      reciever_id,
      reciever_type,
      notification,
      time_sent,
      time_recieved,
      date_sent
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all notifications
notificationRouter.get("/", async (req, res) => {
  try {
    const results = await notificationCrud.getNotifications();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get notification by ID
notificationRouter.get("/:nid", async (req, res) => {
  const { nid } = req.params;

  try {
    const results = await notificationCrud.getNotificationById(nid);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: "404", message: "Notification not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update notification by ID
notificationRouter.put("/:nid", async (req, res) => {
  const { nid } = req.params;
  const updatedValues = req.body;

  try {
    const response = await notificationCrud.updateNotification(
      nid,
      updatedValues
    );
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete notification by ID
notificationRouter.delete("/:nid", async (req, res) => {
  const { nid } = req.params;

  try {
    const response = await notificationCrud.deleteNotification(nid);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = notificationRouter;

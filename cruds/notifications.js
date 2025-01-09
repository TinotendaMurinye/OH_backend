require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let notificationCrud = {};

// Create a new notification
notificationCrud.postNotification = async (
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
) => {
  const query = `
    INSERT INTO notifications (
      nid, sender, reciever, sender_id, reciever_id, reciever_type, 
      notification, time_sent, time_recieved, date_sent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
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
  ];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Notification saved successfully",
    nid: result.insertId,
  };
};

// Get all notifications
notificationCrud.getNotifications = async () => {
  const [results] = await pool.execute("SELECT * FROM notifications");
  return results;
};

// Get notification by ID
notificationCrud.getNotificationById = async (nid) => {
  const [results] = await pool.execute(
    "SELECT * FROM notifications WHERE nid = ?",
    [nid]
  );
  return results;
};

// Update notification by ID
notificationCrud.updateNotification = async (nid, updatedValues) => {
  const fieldsToUpdate = {};

  for (const key in updatedValues) {
    if (updatedValues[key] !== undefined) {
      fieldsToUpdate[key] = updatedValues[key] === null ? null : updatedValues[key]; // Handle explicit null
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields to update");
  }

  const setExpressions = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(fieldsToUpdate), nid];

  const query = `UPDATE notifications SET ${setExpressions} WHERE nid = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "Notification updated successfully",
  };
};

// Delete notification by ID
notificationCrud.deleteNotification = async (nid) => {
  const [result] = await pool.execute(
    "DELETE FROM notifications WHERE nid = ?",
    [nid]
  );
  return {
    status: "200",
    message: "Notification deleted successfully",
  };
};

module.exports = notificationCrud;
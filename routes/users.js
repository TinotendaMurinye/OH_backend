const express = require("express");
const userCrud = require("../cruds/users"); // Update the path as necessary
const userRouter = express.Router();

// Create a new user
userRouter.post("/", async (req, res) => {
  const {
    account_type,
    username,
    email,
    password,
    registration,
    last_logged,
    online_status,
    reg_number,
  } = req.body;

  try {
    const response = await userCrud.postUser(
      account_type,
      username,
      email,
      password,
      registration,
      last_logged,
      online_status,
      reg_number
    );
    res.status(201).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all users
userRouter.get("/", async (req, res) => {
  try {
    const results = await userCrud.getUsers();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get user by ID
userRouter.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const results = await userCrud.getUserById(user_id);
    if (results.length === 0) {
      return res.status(404).json({ status: "404", message: "User not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update user by ID
userRouter.put("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const updatedValues = req.body;

  try {
    const response = await userCrud.updateUser(user_id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "No valid fields to update") {
      return res.status(400).json({ status: "400", message: err.message });
    }
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete user by ID
userRouter.delete("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const response = await userCrud.deleteUser(user_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});
// Check user credentials via URL parameters (email and password)
userRouter.get("/:email/:password", async (req, res) => {
  const { email, password } = req.params;

  try {
    const response = await userCrud.checkUserCredentials(email, password);
    if (response.status === "401") {
      return res.status(401).json(response);
    }
    res.status(200).json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = userRouter;

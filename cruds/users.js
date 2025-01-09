require("dotenv").config();
const pool = require("../poolfile"); // Ensure the path to your pool file is correct

let userCrud = {};

// Create a new user
const generateUserId = async () => {
  // Step 1: Retrieve the last user ID
  const [results] = await pool.execute("SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1");
  
  let userId;

  if (results.length > 0) {
    // Step 2: Extract the numeric part and increment it
    const lastUserId = results[0].user_id;
    const lastNumber = parseInt(lastUserId.slice(1)); // Remove 'F' and parse to integer
    const newNumber = lastNumber + 1;

    // Step 3: Format the new user ID
    userId = `F${String(newNumber).padStart(9, '0')}`; // Pad with zeros
  } else {
    // If no users exist, start with F000000001
    userId = 'F000000001';
  }

  return userId;
};

// Create a new user
userCrud.postUser = async (
  account_type,
  username,
  email,
  password,
  registration,
  last_logged,
  online_status,
  reg_number
) => {
  const user_id = await generateUserId(); // Generate custom user ID
  const query = `
    INSERT INTO users (
      user_id, account_type, username, email, password, registration, 
      last_logged, online_status, reg_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    user_id,
    account_type,
    username,
    email,
    password,
    registration,
    last_logged,
    online_status,
    reg_number,
  ];

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "User saved successfully",
    user_id: user_id, // Return the custom user ID
  };
};

// Get all users
userCrud.getUsers = async () => {
  const [results] = await pool.execute("SELECT * FROM users");
  return results;
};

// Get user by ID
userCrud.getUserById = async (user_id) => {
  const [results] = await pool.execute(
    "SELECT * FROM users WHERE user_id = ?",
    [user_id]
  );
  return results;
};

// Update user by ID
userCrud.updateUser = async (user_id, updatedValues) => {
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

  const values = [...Object.values(fieldsToUpdate), user_id];

  const query = `UPDATE users SET ${setExpressions} WHERE user_id = ?`;

  const [result] = await pool.execute(query, values);
  return {
    status: "200",
    message: "User updated successfully",
  };
};

// Delete user by ID
userCrud.deleteUser = async (user_id) => {
  const [result] = await pool.execute(
    "DELETE FROM users WHERE user_id = ?",
    [user_id]
  );
  return {
    status: "200",
    message: "User deleted successfully",
  };
};


userCrud.checkUserCredentials = async (email, password) => {
  const query = `
    SELECT * FROM users WHERE email = ? AND password = ?`;

  const values = [email, password];

  const [results] = await pool.execute(query, values);

  if (results.length === 0) {
    return {
      status: "401",
      message: "Invalid email or password",
    };
  }

  return {
    status: "200",
    message: "User authenticated successfully",
    user: results[0], // Return the user object
  };
};


module.exports = userCrud;
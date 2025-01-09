const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.APPPORT || 3003;

// Importing the routers
const applicationRouter = require("./routes/applications");
const documentationRouter = require("./routes/documentation");
const studentRouter = require("./routes/student");
const classRouter = require("./routes/class");
const notificationRouter = require("./routes/notifications");
const subjectRouter = require("./routes/subject");
const teacherRouter = require("./routes/teacher");
const userRouter = require("./routes/users"); // Corrected this line
const academicResultsRouter = require("./routes/academic_results"); // Added this line
const attachmentsRouter = require("./routes/attachments"); // Added this line
const schoolRouter = require("./routes/School");
const subPackageRouter = require("./routes/subPackages");
const fetchRouter = require("./routes/fetchRoute");
const acceptanceAppRoute = require("./routes/acceptance_app");
const router = require("./routes/application_invoice");
// Middleware
// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" })); // JSON parsing with limit
app.use(express.urlencoded({ limit: "100mb", extended: true })); // URL-encoded data with limit

// Route Usage
app.use("/applications", applicationRouter);
app.use("/documentation", documentationRouter);
app.use("/students", studentRouter);
app.use("/class", classRouter); // Fixed this line
app.use("/notifications", notificationRouter); // Added notification routes
app.use("/subject", subjectRouter);
app.use("/teachers", teacherRouter); // Added teacher routes
app.use("/users", userRouter); // Added user routes
app.use("/academic-results", academicResultsRouter); // Added academic results routes
app.use("/attachments", attachmentsRouter);
app.use("/school", schoolRouter);
app.use("/subPackages", subPackageRouter);
app.use("/sync", fetchRouter);
app.use("/acceptance_app", acceptanceAppRoute);
app.use("/application_invoice", router);
// Health check route
app.get("/", (req, res) => {
  res.send("Open_Galaxy");
});

// Sample route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Additional route example
app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
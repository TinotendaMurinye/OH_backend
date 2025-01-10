const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.APPPORT || 3003;

// CORS configuration
const corsOptions = {
  origin: "https://blue-partridge-803580.hostingersite.com", // Allow this domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
  credentials: true, // Allow credentials if needed
};

// Middleware
app.use(cors(corsOptions)); // Apply the CORS options here
app.use(express.json({ limit: "100mb" })); // JSON parsing with limit
app.use(express.urlencoded({ limit: "100mb", extended: true })); // URL-encoded data with limit

// Importing the routers
const applicationRouter = require("./routes/applications");
const documentationRouter = require("./routes/documentation");
const studentRouter = require("./routes/student");
const classRouter = require("./routes/class");
const notificationRouter = require("./routes/notifications");
const subjectRouter = require("./routes/subject");
const teacherRouter = require("./routes/teacher");
const userRouter = require("./routes/users");
const academicResultsRouter = require("./routes/academic_results");
const attachmentsRouter = require("./routes/attachments");
const schoolRouter = require("./routes/School");
const subPackageRouter = require("./routes/subPackages");
const fetchRouter = require("./routes/fetchRoute");
const acceptanceAppRoute = require("./routes/acceptance_app");
const invoiceRouter = require("./routes/application_invoice");

// Route Usage
app.use("/applications", applicationRouter);
app.use("/documentation", documentationRouter);
app.use("/students", studentRouter);
app.use("/class", classRouter);
app.use("/notifications", notificationRouter);
app.use("/subject", subjectRouter);
app.use("/teachers", teacherRouter);
app.use("/users", userRouter);
app.use("/academic-results", academicResultsRouter);
app.use("/attachments", attachmentsRouter);
app.use("/school", schoolRouter);
app.use("/subPackages", subPackageRouter);
app.use("/sync", fetchRouter);
app.use("/acceptance_app", acceptanceAppRoute);
app.use("/application_invoice", invoiceRouter);

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
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// SSL options
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/srv690692.hstgr.cloud/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/srv690692.hstgr.cloud/fullchain.pem'),
};

// Start the HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server is running on https://srv690692.hstgr.cloud:${PORT}`);
});

// Optional: Redirect HTTP to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);
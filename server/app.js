require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { initSocket } = require("./socket");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sales_crm";

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check route
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Sales CRM backend is running",
    });
});

// Routes
const leadRoutes = require("./routes/leads");
const callerRoutes = require("./routes/callers");
app.use("/api/leads", leadRoutes);
app.use("/api/callers", callerRoutes);

// Global error handler (must be after routes)
app.use(errorHandler);

async function start() {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "sales_crm",
        });

        console.log("Connected to MongoDB");

        // Initialize Socket.io with the HTTP server
        initSocket(server);

        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();

module.exports = { app, server };

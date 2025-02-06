require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define Mongoose Schema
const DataEntrySchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  gpu: {
    type: String,
    required: true,
  },
  energy: {
    type: Number,
    required: true,
    min: 0,
  },
  emissions: {
    type: Number,
    required: true,
    min: 0,
  },
  runtime: {
    type: Number,
    required: true,
    min: 0,
  },
  github_user: {
    type: String,
  },
  date_added: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
      message: (props) => `${props.value} is not a valid date format (YYYY-MM-DD)!`,
    },
  },
  timestamp: {
    type: Date, // ISODate format
    default: null, // Can be null if not provided
  },
  gpu_location: {
    type: String, // Optional field
    default: "Unknown",
  },
  remarks: {
    type: String, // Optional field
    default: "No remarks provided",
  },
});

// Create Mongoose Model with Explicit Collection Name
const DataEntry = mongoose.model("DataEntry", DataEntrySchema, "data_entries");

// API Endpoints

// Default Route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Create Data Entry
app.post("/api/data", async (req, res) => {
  try {
    let { timestamp, ...data } = req.body;

    // ✅ Convert "NA" or empty timestamp to `null`
    if (timestamp === "NA" || timestamp === "") {
      timestamp = null;
    } else {
      timestamp = new Date(timestamp); // Convert valid timestamps to Date object
    }

    const dataEntry = new DataEntry({
      ...data,
      timestamp, // ✅ Use the converted timestamp
      date_added: new Date().toISOString().split("T")[0], // Automatically set today's date
    });

    const savedData = await dataEntry.save();
    res.status(201).json({ message: "Data added successfully!", data: savedData });
  } catch (error) {
    console.error("Error creating data entry:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get All Data Entries
app.get("/api/data", async (req, res) => {
  try {
    const dataEntries = await DataEntry.find(); // Fetch all entries
    res.status(200).json(dataEntries);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Data Entry by ID
app.delete("/api/data/:id", async (req, res) => {
  try {
    const deletedData = await DataEntry.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ message: "Data entry not found" });
    }
    res.status(200).json({ message: "Data entry deleted successfully", data: deletedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Data Entry by ID
app.put("/api/data/:id", async (req, res) => {
  try {
    const updatedData = await DataEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedData) {
      return res.status(404).json({ message: "Data entry not found" });
    }
    res.status(200).json({ message: "Data entry updated successfully", data: updatedData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

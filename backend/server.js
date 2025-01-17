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
    enum: ["LLaMA-2-7B", "Mistral-7B", "Gemma-2B", "Gemma-7B"], // Valid models
  },
  task: {
    type: String,
    required: true,
    enum: ["Question Answering", "Text Summarisation", "Sentiment Analysis"], // Valid tasks
  },
  gpu: {
    type: String,
    required: true,
    enum: ["T4", "L4", "A100"], // Valid GPUs
  },
  energy: {
    type: Number,
    required: true,
    min: 0, // Must be positive
  },
  emissions: {
    type: Number,
    required: true,
    min: 0, // Must be positive
  },
  emissionsRate: {
    type: String,
    required: true,
  },
  runtime: {
    type: Number,
    required: true,
    min: 0, // Must be positive
  },
  github_user: {
    type: String,
    required: true,
  },
  date_added: {
    type: String, // Store date as string in YYYY-MM-DD format
    required: true,
    validate: {
      validator: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v), // Regex to validate date format
      message: (props) => `${props.value} is not a valid date format (YYYY-MM-DD)!`,
    },
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
    const dataEntry = new DataEntry(req.body);
    const savedData = await dataEntry.save();
    res.status(201).json({ message: "Data added successfully!", data: savedData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Data Entries
app.get("/api/data", async (req, res) => {
    try {
      const dataEntries = await DataEntry.find(); // Fetches only actual data documents
      console.log("Fetched Data Entries:", dataEntries); // Debugging
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
      runValidators: true, // Ensure data is validated
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

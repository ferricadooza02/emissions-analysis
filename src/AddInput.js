import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { ArrowDownward, ArrowUpward, Remove } from "@mui/icons-material";

// Function to format numbers in scientific notation
const formatScientificNotation = (value) => {
  const [base, exponent] = value.toExponential(2).split("e");
  return `${base} x 10^${exponent}`;
};

const AddInput = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    task: "",
    gpu: "",
    energy: "",
    emissions: "",
    runtime: "",
    github_user: "",
    gpu_location: "", 
    code_environment: "",
    timestamp: "", 
    remarks: "", 
    otherModel: "",
    otherTask: "",
    otherGpu: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [filters, setFilters] = useState({
    model: "",
    task: "",
    gpu: "",
    gpu_location: "",
    code_environment: "",
    github_user: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "normal" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get("http://localhost:5000/api/data");
        const response = await axios.get("https://fyp-ui.onrender.com/api/data"); // Updated URL
        setRows(response.data);
        //setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
        //setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.model || (formData.model === "Others" && !formData.otherModel)) {
      errors.model = "Model is required.";
    }
    if (!formData.task || (formData.task === "Others" && !formData.otherTask)) {
      errors.task = "Task is required.";
    }
    if (!formData.gpu || (formData.gpu === "Others" && !formData.otherGpu)) {
      errors.gpu = "GPU is required.";
    }
    if (!formData.energy || formData.energy <= 0 || isNaN(formData.energy)) {
      errors.energy = "Valid energy is required.";
    }
    if (!formData.emissions || formData.emissions <= 0 || isNaN(formData.emissions)) {
      errors.emissions = "Valid emissions value is required.";
    }
    if (!formData.runtime || formData.runtime <= 0 || isNaN(formData.runtime)) {
      errors.runtime = "Valid runtime is required.";
    }
    if (!formData.gpu_location) {
      errors.gpu_location = "GPU Location is required.";
    }
    if (!formData.code_environment) {
      errors.code_environment = "Code Environment is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit = {
        model: formData.model === "Others" ? formData.otherModel : formData.model,
        task: formData.task === "Others" ? formData.otherTask : formData.task,
        gpu: formData.gpu === "Others" ? formData.otherGpu : formData.gpu,
        energy: formData.energy,
        emissions: formData.emissions,
        runtime: formData.runtime,
        github_user: formData.github_user || null,
        date_added: new Date().toISOString().split("T")[0],
        gpu_location: formData.gpu_location,
        code_environment: formData.code_environment, 
        timestamp: formData.timestamp || "NA", 
        remarks: formData.remarks || null, 
      };
      await axios.post("https://fyp-ui.onrender.com", dataToSubmit);
      // await axios.post("http://localhost:5000/api/data", dataToSubmit);
      setRows((prevRows) => [...prevRows, dataToSubmit]);
      setOpen(false);
      setFormData({
        model: "",
        task: "",
        gpu: "",
        energy: "",
        emissions: "",
        runtime: "",
        github_user: "",
        otherModel: "",
        otherTask: "",
        otherGpu: "",
      });
    } catch (err) {
      console.error("Error adding data:", err);
      alert("Failed to submit data. Please check console logs.");
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "normal"; // Reset to normal state
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortConfig.direction === "normal") return 0; // No sorting
    const isAscending = sortConfig.direction === "ascending";
    const aValue =
      sortConfig.key === "emissionsRate" ? a.emissions / (a.runtime * 60) : a[sortConfig.key];
    const bValue =
      sortConfig.key === "emissionsRate" ? b.emissions / (b.runtime * 60) : b[sortConfig.key];
    if (aValue < bValue) return isAscending ? -1 : 1;
    if (aValue > bValue) return isAscending ? 1 : -1;
    return 0;
  });

  const filteredRows = sortedRows.filter((row) =>
    Object.entries(filters).every(
      ([key, value]) =>
        !value || row[key]?.toLowerCase().includes(value.toLowerCase())
    )
  );

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") return <ArrowUpward />;
      if (sortConfig.direction === "descending") return <ArrowDownward />;
    }
    return <Remove />; // Default icon for "normal" state
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="sticky" className="transparent-navbar">
        <Toolbar sx={{ justifyContent: "center", gap: 12 }}>
          <NavLink to="/" className="navbar-link">
            <Typography variant="h6" component="div">
              Home
            </Typography>
          </NavLink>
        </Toolbar>
      </AppBar>

      {/* Title and Add Input Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          maxWidth: "90%",
          margin: "20px auto",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "white", flexGrow: 1, textAlign: "center" }}
        >
          Model-Task Energy Consumption & Emissions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ position: "absolute", right: 0 }}
          onClick={() => setOpen(true)}
        >
          Add Input
        </Button>
      </Box>

      {/* Show message if no data is available */}
      {rows.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Typography variant="h6" color="white">
            Backend server is starting, please refresh the page in 1-2 minutes...
          </Typography>
        </Box>
      )}

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          margin: "20px auto",
          maxWidth: "90%",
        }}
      >
        <TextField
          placeholder="Filter by Model" // Use placeholder instead of label
          variant="outlined"
          name="model"
          value={filters.model}
          onChange={handleFilterChange}
          fullWidth
          sx={{
            input: { color: "white" }, // Makes the typed text white
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" }, // White border
              "&:hover fieldset": { borderColor: "white" }, // White border on hover
              "&.Mui-focused fieldset": { borderColor: "white" }, // White border when focused
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white", // Placeholder text color
              opacity: 1,
            },
          }}
        />
        <TextField
          placeholder="Filter by Task"
          variant="outlined"
          name="task"
          value={filters.task}
          onChange={handleFilterChange}
          fullWidth
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
              opacity: 1,
            },
          }}
        />
        <TextField
          placeholder="Filter by GPU"
          variant="outlined"
          name="gpu"
          value={filters.gpu}
          onChange={handleFilterChange}
          fullWidth
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
              opacity: 1,
            },
          }}
        />
        <TextField
          placeholder="Filter by GPU Location" // New filter
          variant="outlined"
          name="gpu_location" // Ensure the filter name matches your state structure
          value={filters.gpu_location}
          onChange={handleFilterChange}
          fullWidth
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
              opacity: 1,
            },
          }}
        />
        <TextField
          placeholder="Filter by Code Environment" // New filter field
          variant="outlined"
          name="code_environment"
          value={filters.code_environment}
          onChange={handleFilterChange}
          fullWidth
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputBase-input::placeholder": { color: "white", opacity: 1 },
          }}
        />
        <TextField
          placeholder="Filter by GitHub User"
          variant="outlined"
          name="github_user"
          value={filters.github_user}
          onChange={handleFilterChange}
          fullWidth
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "white",
              opacity: 1,
            },
          }}
        />
        {/* Clear Filters Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setFilters({
            model: "",
            task: "",
            gpu: "",
            gpu_location: "",
            code_environment: "",
            github_user: "",
          })}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Show message if filters are applied but no data is found */}
      {filteredRows.length === 0 && Object.values(filters).some(value => value) && (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Typography variant="h6" color="white">
            No available data for filters entered.
          </Typography>
        </Box>
      )}

      <Box sx={{ maxWidth: "90%", margin: "20px auto", position: "relative" }}>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            maxHeight: "70vh", // Limit table height to enable scrolling
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Model</strong></TableCell>
                <TableCell><strong>Task</strong></TableCell>
                <TableCell><strong>GPU</strong></TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexDirection: "row-reverse" }}>
                    <strong>Energy (kWh)</strong>
                    <IconButton onClick={() => handleSort("energy")}>
                      {renderSortIcon("energy")}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexDirection: "row-reverse" }}>
                    <strong>Emissions (kg CO₂)</strong>
                    <IconButton onClick={() => handleSort("emissions")}>
                      {renderSortIcon("emissions")}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexDirection: "row-reverse" }}>
                    <strong>Runtime (min)</strong>
                    <IconButton onClick={() => handleSort("runtime")}>
                      {renderSortIcon("runtime")}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexDirection: "row-reverse" }}>
                    <strong>Emissions Rate (g CO₂ eq. / s)</strong>
                    <IconButton onClick={() => handleSort("emissionsRate")}>
                      {renderSortIcon("emissionsRate")}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell><strong>GPU Location</strong></TableCell>
                <TableCell><strong>Code Environment</strong></TableCell>
                <TableCell><strong>Timestamp</strong></TableCell>
                <TableCell><strong>GitHub User</strong></TableCell>
                <TableCell><strong>Date Added</strong></TableCell>
                <TableCell><strong>Remarks</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.model}</TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell>{row.gpu}</TableCell>
                <TableCell>{row.energy}</TableCell>
                <TableCell>{row.emissions}</TableCell>
                <TableCell>{row.runtime}</TableCell>
                <TableCell>
                  {formatScientificNotation(row.emissions / (row.runtime * 60))}
                </TableCell>
                <TableCell>{row.gpu_location}</TableCell>
                <TableCell>{row.code_environment}</TableCell>
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>{row.github_user}</TableCell>
                <TableCell>{row.date_added}</TableCell>
                <TableCell>{row.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Input</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            fullWidth
            select
            error={!!formErrors.model}
            helperText={formErrors.model}
          >
            {["LLaMA-2-7B", "Mistral-7B", "Gemma-2B", "Gemma-7B", "Others"].map(
              (option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              )
            )}
          </TextField>
          {formData.model === "Others" && (
            <TextField
              margin="dense"
              label="Custom Model"
              name="otherModel"
              value={formData.otherModel}
              onChange={handleChange}
              fullWidth
            />
          )}

          <TextField
            margin="dense"
            label="Task"
            name="task"
            value={formData.task}
            onChange={handleChange}
            fullWidth
            select
            error={!!formErrors.task}
            helperText={formErrors.task}
          >
            {["Question Answering", "Text Summarisation", "Sentiment Analysis", "Others"].map(
              (option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              )
            )}
          </TextField>
          {formData.task === "Others" && (
            <TextField
              margin="dense"
              label="Custom Task"
              name="otherTask"
              value={formData.otherTask}
              onChange={handleChange}
              fullWidth
            />
          )}

          <TextField
            margin="dense"
            label="GPU"
            name="gpu"
            value={formData.gpu}
            onChange={handleChange}
            fullWidth
            select
            error={!!formErrors.gpu}
            helperText={formErrors.gpu}
          >
            <MenuItem value="" disabled>
              Click Others to specify GPU Model, e.g., NVIDIA T4
            </MenuItem>
            {["T4", "L4", "A100", "Others"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {formData.gpu === "Others" && (
            <TextField
              margin="dense"
              label="Custom GPU"
              name="otherGpu"
              value={formData.otherGpu}
              onChange={handleChange}
              fullWidth
            />
          )}

          <TextField
            margin="dense"
            label="Energy (kWh)"
            name="energy"
            value={formData.energy}
            onChange={handleChange}
            fullWidth
            type="number"
            error={!!formErrors.energy}
            helperText={formErrors.energy}
          />
          <TextField
            margin="dense"
            label="Emissions (kg CO₂)"
            name="emissions"
            value={formData.emissions}
            onChange={handleChange}
            fullWidth
            type="number"
            error={!!formErrors.emissions}
            helperText={formErrors.emissions}
          />
          <TextField
            margin="dense"
            label="Runtime (min)"
            name="runtime"
            value={formData.runtime}
            onChange={handleChange}
            fullWidth
            type="number"
            error={!!formErrors.runtime}
            helperText={formErrors.runtime}
          />
          <TextField
            margin="dense"
            label="GitHub User"
            name="github_user"
            value={formData.github_user}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="GPU Location"
            name="gpu_location"
            value={formData.gpu_location}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.gpu_location}
            helperText={formErrors.gpu_location}
          />
          <TextField
            margin="dense"
            label="Code Environment"
            name="code_environment"
            value={formData.code_environment}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.code_environment}
            helperText={formErrors.code_environment}
          />
          <TextField
            margin="dense"
            label="Timestamp (YYYY-MM-DDTHH:MM:SS)"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.timestamp}
            helperText={formErrors.timestamp}
          />
          <TextField
            margin="dense"
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddInput;

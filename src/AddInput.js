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
} from "@mui/material";
import { NavLink } from "react-router-dom";

// Function to format numbers in scientific notation
const formatScientificNotation = (value) => {
  const [base, exponent] = value.toExponential(2).split("e");
  return `${base} x 10^${exponent}`;
};

const AddInput = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");
        setRows(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Typography align="center" variant="h6" sx={{ marginTop: 4, color: "white" }}>
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography align="center" variant="h6" color="error" sx={{ marginTop: 4 }}>
        {error}
      </Typography>
    );
  }

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
          <NavLink to="/add-input" className="navbar-link">
            <Typography variant="h6" component="div">
              Add Input
            </Typography>
          </NavLink>
        </Toolbar>
      </AppBar>

      {/* Table Header */}
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ marginTop: 4, color: "white" }}
      >
        Add Input Data
      </Typography>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "90%",
          margin: "20px auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Model</strong>
              </TableCell>
              <TableCell>
                <strong>Task</strong>
              </TableCell>
              <TableCell>
                <strong>GPU</strong>
              </TableCell>
              <TableCell>
                <strong>Energy (kWh)</strong>
              </TableCell>
              <TableCell>
                <strong>Emissions (kg CO₂)</strong>
              </TableCell>
              <TableCell>
                <strong>Runtime (min)</strong>
              </TableCell>
              <TableCell>
                <strong>Emissions Rate (g CO₂ eq. / s)</strong>
              </TableCell>
              <TableCell>
                <strong>GitHub User</strong>
              </TableCell>
              <TableCell>
                <strong>Date Added</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
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
                <TableCell>{row.github_user}</TableCell>
                <TableCell>{row.date_added}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddInput;

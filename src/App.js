import { modelInfo, taskDescriptions, gpuInfo, emissionsData } from "./data";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import AddInput from "./AddInput";
import "./App.css";
import HyperparameterOptimisation from "./components/HyperparameterOptimisation";
import {
  AppBar,
  Toolbar,
  Box,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Link as ScrollLink } from "react-scroll";
import { NavLink } from "react-router-dom";

const App = () => {
  const [model, setModel] = useState("");
  const [task, setTask] = useState("");
  const [gpu, setGpu] = useState("");
  const [lastSelection, setLastSelection] = useState({
    model: "",
    task: "",
    gpu: "",
  });
  const [showData, setShowData] = useState(false);

  const handleModelChange = (event) => setModel(event.target.value);
  const handleTaskChange = (event) => setTask(event.target.value);
  const handleGpuChange = (event) => setGpu(event.target.value);

  const handleViewDataClick = () => {
    setLastSelection({ model, task, gpu });
    setShowData(true);
  };

  const renderData = () => {
    if (!showData) return null;

    if (
      model !== lastSelection.model ||
      task !== lastSelection.task ||
      gpu !== lastSelection.gpu
    )
      return null;

    const modelData = modelInfo[model];
    const taskData = taskDescriptions[task];
    const gpuData = gpuInfo[gpu];
    const emissions_data = emissionsData?.[model]?.[task]?.[gpu] || {
      energy: "-",
      emissions: "-",
      emissionsRate: "-",
      duration: "-",
    };

    return (
      <div>
        <Box display="flex" gap={2} mb={2}>
          <Card className="transparent-card">
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#a3cff7", fontWeight: "bold" }}
              >
                {modelData?.name || "Unknown Model"}
              </Typography>
              <Typography>{modelData?.description || "No description available."}</Typography>
            </CardContent>
          </Card>
          <Card className="transparent-card">
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#a3cff7", fontWeight: "bold" }}
              >
                {taskData?.name || "Unknown Task"}
              </Typography>
              <Typography>{taskData?.definition || "No definition available."}</Typography>
            </CardContent>
          </Card>
          <Card className="transparent-card">
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#a3cff7", fontWeight: "bold" }}
              >
                {gpuData?.name || "Unknown GPU"}
              </Typography>
              <Typography>{gpuData?.description || "No description available."}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#b67991"
            color="black"
            borderRadius="8px"
            padding="8px"
          >
            <Typography variant="body1">Energy (kWh)</Typography>
            <Typography variant="h4" color="black">
              {emissions_data.energy}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#b67991"
            color="black"
            borderRadius="8px"
            padding="8px"
          >
            <Typography variant="body1">Emissions (g CO₂ eq.)</Typography>
            <Typography variant="h4" color="black">
              {emissions_data.emissions}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#b67991"
            color="black"
            borderRadius="8px"
            padding="8px"
          >
            <Typography variant="body1">Emissions Rate (g CO₂ eq. / s)</Typography>
            <Typography variant="h4" color="black">
              {emissions_data.emissionsRate}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#b67991"
            color="black"
            borderRadius="8px"
            padding="8px"
          >
            <Typography variant="body1">Runtime (min)</Typography>
            <Typography variant="h4" color="black">
              {emissions_data.duration}
            </Typography>
          </Box>
        </Box>
      </div>
    );
  };

  const Navbar = () => {
    const location = useLocation();

    if (location.pathname === "/add-input") return null;

    return (
      <AppBar position="sticky" className="transparent-navbar">
        <Toolbar sx={{ justifyContent: "center", gap: 12 }}>
          <ScrollLink to="introduction" smooth offset={-70} duration={500}>
            <Typography variant="h6" component="div" className="navbar-link">
              Introduction
            </Typography>
          </ScrollLink>
          <ScrollLink to="evaluation" smooth offset={-70} duration={500}>
            <Typography variant="h6" component="div" className="navbar-link">
              Empirical Evaluation
            </Typography>
          </ScrollLink>
          <NavLink to="/add-input" className="navbar-link">
            <Typography variant="h6" component="div">
              Add Input
            </Typography>
          </NavLink>
          <ScrollLink to="hyperparameter" smooth offset={-70} duration={500}>
            <Typography variant="h6" component="div" className="navbar-link">
              Hyperparameter Optimisation
            </Typography>
          </ScrollLink>
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <Router basename="/fyp-ui">
      <div className="App">
        <div className="background-overlay"></div>
        <Navbar />
        <Routes>
          { /* <Route path="/" element={<Navigate to="/home" replace />} /> */ }
          <Route
            path="/"
            element={
              <Box sx={{ padding: 3 }} className="content">
                <Typography variant="h2" gutterBottom align="center" sx={{ padding: 6 }}>
                  Emissions Analysis of LLMs
                </Typography>
                <Box id="introduction" sx={{ padding: 3, paddingTop: 10 }}>
                  <Typography variant="h4" gutterBottom>
                    Introduction
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                    Welcome to the Emissions Analysis of Large Language Models (LLMs). Explore the
                    insights of my FYP research.
                  </Typography>
                </Box>
                <Box id="evaluation" sx={{ padding: 3, paddingTop: 10 }}>
                  <Typography variant="h4" gutterBottom>
                    Empirical Evaluation
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <FormControl fullWidth>
                      <Select
                        value={model}
                        onChange={handleModelChange}
                        displayEmpty
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          ".MuiSvgIcon-root": { color: "white" },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                        }}
                      >
                        <MenuItem value="" sx={{ color: "black", backgroundColor: "white" }}>
                          Select Model
                        </MenuItem>
                        {Object.keys(modelInfo).map((key) => (
                          <MenuItem
                            key={key}
                            value={key}
                            sx={{ color: "black", backgroundColor: "white" }}
                          >
                            {modelInfo[key].name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <Select
                        value={task}
                        onChange={handleTaskChange}
                        displayEmpty
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          ".MuiSvgIcon-root": { color: "white" },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                        }}
                      >
                        <MenuItem value="" sx={{ color: "black", backgroundColor: "white" }}>
                          Select Task
                        </MenuItem>
                        {Object.keys(taskDescriptions).map((key) => (
                          <MenuItem
                            key={key}
                            value={key}
                            sx={{ color: "black", backgroundColor: "white" }}
                          >
                            {taskDescriptions[key].name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <Select
                        value={gpu}
                        onChange={handleGpuChange}
                        displayEmpty
                        sx={{
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          ".MuiSvgIcon-root": { color: "white" },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                        }}
                      >
                        <MenuItem value="" sx={{ color: "black", backgroundColor: "white" }}>
                          Select GPU
                        </MenuItem>
                        {Object.keys(gpuInfo).map((key) => (
                          <MenuItem
                            key={key}
                            value={key}
                            sx={{ color: "black", backgroundColor: "white" }}
                          >
                            {gpuInfo[key].name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={handleViewDataClick}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#065387",
                        color: "#ffffff",
                        "&:hover": { backgroundColor: "#012e58" },
                        fontWeight: "bold",
                      }}
                    >
                      VIEW DATA
                    </Button>
                  </Box>
                  <Box>{renderData()}</Box>
                </Box>
                <Box id="hyperparameter" sx={{ padding: 3, paddingTop: 10 }}>
                  <HyperparameterOptimisation />
                </Box>
              </Box>
            }
          />
          <Route path="/add-input" element={<AddInput />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
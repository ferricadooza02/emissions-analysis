import { modelInfo, taskDescriptions, gpuInfo, emissionsData } from "./data";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import AddInput from "./AddInput";
import "./App.css";
// import HyperparameterOptimisation from "./components/HyperparameterOptimisation";
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
import EmissionsEstimation from "./components/EmissionsEstimation"; // ✅ New component
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // ✅ For dropdown icon
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from "@mui/material"; // ✅ Accordion UI


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

  // Dummy data
  const models = ["LLaMA-2-7B", "Mistral-7B", "Gemma-2B", "Gemma-7B"];
  const tasks = [
    "Question Answering",
    "Text Summarisation",
    "Sentiment Analysis",
  ];
  const gpus = ["T4", "L4", "A100"];

  const handleModelChange = (event) => setModel(event.target.value);
  const handleTaskChange = (event) => setTask(event.target.value);
  const handleGpuChange = (event) => setGpu(event.target.value);

  const handleViewDataClick = () => {
    setLastSelection({ model, task, gpu });
    setShowData(true);
  };

  const getTableData = () => {
    let data = [];
    if (model && task && !gpu) {
      for (let gpu in gpuInfo) {
        const entry = emissionsData[model]?.[task]?.[gpu];
        data.push({
          gpu,
          energy: entry?.energy || "-",
          emissions: entry?.emissions || "-",
          emissionsRate: entry?.emissionsRate || "-",
          duration: entry?.duration || "-",
        });
      }
    } else if (task && gpu && !model) {
      for (let model in modelInfo) {
        const entry = emissionsData[model]?.[task]?.[gpu];
        data.push({
          model,
          energy: entry?.energy || "-",
          emissions: entry?.emissions || "-",
          emissionsRate: entry?.emissionsRate || "-",
          duration: entry?.duration || "-",
        });
      }
    } else if (model && gpu && !task) {
      for (let task in taskDescriptions) {
        const entry = emissionsData[model]?.[task]?.[gpu];
        data.push({
          task,
          energy: entry?.energy || "-",
          emissions: entry?.emissions || "-",
          emissionsRate: entry?.emissionsRate || "-",
          duration: entry?.duration || "-",
        });
      }
    }
    return data;
  };

  const renderData = () => {
    if (!showData) return null;
    if (
      model !== lastSelection.model ||
      task !== lastSelection.task ||
      gpu !== lastSelection.gpu
    )
      return null;

    if (model && task && gpu) {
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
                  {modelData.name}
                </Typography>
                <Typography>{modelData.description}</Typography>
              </CardContent>
            </Card>
            <Card className="transparent-card">
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ color: "#a3cff7", fontWeight: "bold" }}
                >
                  {taskData.name}
                </Typography>
                <Typography>{taskData.definition}</Typography>
              </CardContent>
            </Card>
            <Card className="transparent-card">
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ color: "#a3cff7", fontWeight: "bold" }}
                >
                  {gpuData.name}
                </Typography>
                <Typography>{gpuData.description}</Typography>
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
                {emissions_data?.energy || "-"}
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
                {emissions_data?.emissions || "-"}
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
              <Typography variant="body1">
                Emissions Rate (g CO₂ eq. / s)
              </Typography>
              <Typography variant="h4" color="black">
                {emissions_data?.emissionsRate || "-"}
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
                {emissions_data?.duration || "-"}
              </Typography>
            </Box>
          </Box>
        </div>
      );
    } else if (
      (model && task && !gpu) ||
      (task && gpu && !model) ||
      (model && gpu && !task)
    ) {
      // Two selections made
      const tableData = getTableData();

      return (
        <div>
          <Box display="flex" gap={2} mb={2}>
            {model && (
              <Card className="transparent-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {modelInfo[model].name}
                  </Typography>
                  <Typography>{modelInfo[model].description}</Typography>
                </CardContent>
              </Card>
            )}
            {task && (
              <Card className="transparent-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {taskDescriptions[task].name}
                  </Typography>
                  <Typography>{taskDescriptions[task].definition}</Typography>
                </CardContent>
              </Card>
            )}
            {gpu && (
              <Card className="transparent-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {gpuInfo[gpu].name}
                  </Typography>
                  <Typography>{gpuInfo[gpu].description}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
          <Box display="flex" mb={2}>
            <Card className="transparent-card" sx={{ width: "100%" }}>
              <CardContent>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(5, 1fr)"
                  gap={2}
                >
                  <Typography variant="h6">
                    {model ? (gpu ? "Task" : "GPU") : "Model"}
                  </Typography>
                  <Typography variant="h6">Energy</Typography>
                  <Typography variant="h6">Emissions</Typography>
                  <Typography variant="h6">Emissions Rate</Typography>
                  <Typography variant="h6">Runtime</Typography>
                </Box>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(5, 1fr)"
                  gap={2}
                >
                  <Typography variant="h6" gutterBottom></Typography>
                  <Typography variant="h6" gutterBottom>
                    (kWh)
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    (g CO₂ eq.)
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    (g CO₂ eq. / s)
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    (min)
                  </Typography>
                </Box>
                {tableData.map((row, index) => (
                  <Box
                    key={index}
                    display="grid"
                    gridTemplateColumns="repeat(5, 1fr)"
                    gap={2}
                  >
                    <Typography>{row.model || row.gpu || row.task}</Typography>
                    <Typography>{row.energy}</Typography>
                    <Typography>{row.emissions}</Typography>
                    <Typography>{row.emissionsRate}</Typography>
                    <Typography>{row.duration}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </div>
      );
    } else if (model && !task && !gpu) {
      // Only model selected
      return (
        <div>
          <Card className="transparent-card" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {modelInfo[model].name}
              </Typography>
              <Typography>{modelInfo[model].description}</Typography>
            </CardContent>
          </Card>
          <Card className="transparent-card">
            <CardContent>
              <Box
                display="grid"
                gridTemplateColumns="repeat(5, 1fr)"
                gap={2}
                mt={1}
              >
                <Typography variant="h6">Task</Typography>
                <Typography variant="h6">GPU</Typography>
                <Typography variant="h6">Energy (kWh)</Typography>
                <Typography variant="h6">Emissions (g CO₂ eq.)</Typography>
                <Typography variant="h6">Runtime (min)</Typography>
                {tasks.map((task) =>
                  gpus.map((gpu) => {
                    const entry = emissionsData[model]?.[task]?.[gpu];
                    return (
                      <>
                        <Typography>{task}</Typography>
                        <Typography>{gpu}</Typography>
                        <Typography>{entry?.energy || "-"}</Typography>
                        <Typography>{entry?.emissions || "-"}</Typography>
                        <Typography>{entry?.duration || "-"}</Typography>
                      </>
                    );
                  })
                )}
              </Box>
            </CardContent>
          </Card>
        </div>
      );
    } else if (task && !model && !gpu) {
      // Only task selected
      return (
        <div>
          <Card className="transparent-card" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {taskDescriptions[task].name}
              </Typography>
              <Typography>{taskDescriptions[task].definition}</Typography>
            </CardContent>
          </Card>
          <Card className="transparent-card">
            <CardContent>
              <Box
                display="grid"
                gridTemplateColumns="repeat(5, 1fr)"
                gap={2}
                mt={1}
              >
                <Typography variant="h6">Model</Typography>
                <Typography variant="h6">GPU</Typography>
                <Typography variant="h6">Energy (kWh)</Typography>
                <Typography variant="h6">Emissions (g CO₂ eq.)</Typography>
                <Typography variant="h6">Runtime (min)</Typography>
                {models.map((model) =>
                  gpus.map((gpu) => {
                    const entry = emissionsData[model]?.[task]?.[gpu];
                    return (
                      <>
                        <Typography>{model}</Typography>
                        <Typography>{gpu}</Typography>
                        <Typography>{entry?.energy || "-"}</Typography>
                        <Typography>{entry?.emissions || "-"}</Typography>
                        <Typography>{entry?.duration || "-"}</Typography>
                      </>
                    );
                  })
                )}
              </Box>
            </CardContent>
          </Card>
        </div>
      );
    } else if (gpu && !model && !task) {
      // Only GPU selected
      return (
        <div>
          <Card className="transparent-card" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {gpuInfo[gpu].name}
              </Typography>
              <Typography>{gpuInfo[gpu].description}</Typography>
            </CardContent>
          </Card>
          <Card className="transparent-card">
            <CardContent>
              <Box
                display="grid"
                gridTemplateColumns="repeat(5, 1fr)"
                gap={2}
                mt={1}
              >
                <Typography variant="h6">Model</Typography>
                <Typography variant="h6">Task</Typography>
                <Typography variant="h6">Energy (kWh)</Typography>
                <Typography variant="h6">Emissions (g CO₂ eq.)</Typography>
                <Typography variant="h6">Runtime (min)</Typography>
                {models.map((model) =>
                  tasks.map((task) => {
                    const entry = emissionsData[model]?.[task]?.[gpu];
                    return (
                      <>
                        <Typography>{model}</Typography>
                        <Typography>{task}</Typography>
                        <Typography>{entry?.energy || "-"}</Typography>
                        <Typography>{entry?.emissions || "-"}</Typography>
                        <Typography>{entry?.duration || "-"}</Typography>
                      </>
                    );
                  })
                )}
              </Box>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <Typography variant="body1">
        Please select a model, task, and/or GPU to view data.
      </Typography>
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
          <ScrollLink to="estimation" smooth offset={-70} duration={500}>
            <Typography variant="h6" component="div" className="navbar-link">
              Emissions Estimation
            </Typography>
          </ScrollLink>
          <NavLink to="/add-input" className="navbar-link">
            <Typography variant="h6" component="div">
              Add Input
            </Typography>
          </NavLink>
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
                  Welcome to the Emissions Analysis of Large Language Models (LLMs).
                  This is an interactive UI to explore the results of my FYP research.
                  This dashboard provides insights on the carbon footprint, energy
                  consumption, and efficiency of various LLMs based on model, task,
                  and GPU usage.
                  </Typography>
                </Box>
                <Box id="evaluation" sx={{ padding: 3, paddingTop: 10 }}>
                  <Typography variant="h4" gutterBottom>
                    Empirical Evaluation
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.2rem", paddingBottom: 3 }}
                    gutterBottom
                  >
                    This section presents empirical data on the energy consumption and
                    emissions from fine-tuning <b>4 models</b> across <b>3 tasks</b> on{" "}
                    <b>3 GPUs</b>. Use the dropdowns below to filter the data—select one
                    or more options to explore results for specific models, tasks, or
                    GPUs. If only a model, task, or GPU is selected, all relevant data
                    for the unselected categories will be displayed.
                  </Typography>
                  <Box mb={2} sx={{ paddingBottom: 3 }}>
                  <Accordion className="transparent-card">
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        ".MuiSvgIcon-root": {
                          color: "white", // White color for dropdown icon
                        },
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Methodology
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List sx={{ paddingLeft: 2 }}>
                        <ListItem
                          sx={{ display: "list-item", listStyleType: "disc" }}
                        >
                          <ListItemText
                            primary={
                              <>
                                Energy consumption and emissions are recorded using{" "}
                                <Typography
                                  component="a"
                                  href="https://mlco2.github.io/codecarbon/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  color="#ffffff"
                                  sx={{ textDecoration: "underline" }}
                                >
                                  Code Carbon
                                </Typography>
                                .
                              </>
                            }
                          />
                        </ListItem>
                        <ListItem
                          sx={{ display: "list-item", listStyleType: "disc" }}
                        >
                          <ListItemText primary="Fine-tuning was performed using LoRA (Low-Rank Adaptation) for parameter-efficient tuning." />
                        </ListItem>
                        <ListItem
                          sx={{ display: "list-item", listStyleType: "disc" }}
                        >
                          <ListItemText primary="4-bit quantisation was applied using the BitsAndBytes library to optimise memory and compute efficiency." />
                        </ListItem>
                        <ListItem
                          sx={{ display: "list-item", listStyleType: "disc" }}
                        >
                          <ListItemText
                            primary={
                              <>
                                The displayed data is with respect to a training set
                                comprising 2000 samples, with a batch size of 1.
                                Fine-tuning was conducted for 2 epochs. To estimate
                                variations based on different parameters, refer to the{" "}
                                <Link
                                  to="estimation"
                                  className="methodology-link"
                                  sx={{
                                    color: "#ffffff",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                >
                                  Emissions Estimation
                                </Link>{" "}
                                section.
                              </>
                            }
                          />
                        </ListItem>
                        <ListItem
                          sx={{ display: "list-item", listStyleType: "disc" }}
                        >
                          <ListItemText primary="Gemma-7B could only be fine-tuned on A100." />
                        </ListItem>
                        <ListItem
                          sx={{ display: "list-item", listStyleType: "disc" }}
                        >
                          <ListItemText primary="Mistral-7B could not be fine-tuned on L4 for the sentiment analysis task due to memory constraints." />
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Box>
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
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.5)" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                        }}
                      >
                        <MenuItem value="">Select Model</MenuItem>
                        {Object.keys(modelInfo).map((key) => (
                          <MenuItem key={key} value={key} sx={{ color: "black", backgroundColor: "white" }}>
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
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.5)" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                        }}
                      >
                        <MenuItem value="">Select Task</MenuItem>
                        {Object.keys(taskDescriptions).map((key) => (
                          <MenuItem key={key} value={key} sx={{ color: "black", backgroundColor: "white" }}>
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
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.5)" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                        }}
                      >
                        <MenuItem value="">Select GPU</MenuItem>
                        {Object.keys(gpuInfo).map((key) => (
                          <MenuItem key={key} value={key} sx={{ color: "black", backgroundColor: "white" }}>
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
                <Box id="estimation" sx={{ padding: 3, paddingTop: 10 }}>
                  <EmissionsEstimation />
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
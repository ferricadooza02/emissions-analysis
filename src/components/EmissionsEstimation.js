import { timePerBatchData, powerData } from "../data";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "../App.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";

const EmissionsEstimation = () => {
  const [model, setModel] = useState("");
  const [task, setTask] = useState("");
  const [gpu, setGpu] = useState("");
  const [region, setRegion] = useState("");
  const [datasetSize, setDatasetSize] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [numEpochs, setNumEpochs] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [regions, setRegions] = useState([]);
  const [carbonIntensity, setCarbonIntensity] = useState({});
  const [estimation, setEstimation] = useState(null);

  useEffect(() => {
    // Load CSV file
    fetch(process.env.PUBLIC_URL + "/carbon-intensity-electricity.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            console.log("Parsed CSV Data:", result.data);
            const entities = result.data.map((row) => ({
              label: row.Entity || "Unknown",
            }));
            const intensityMap = {};
            result.data.forEach((row) => {
              intensityMap[row.Entity] = parseFloat(
                row["Carbon intensity of electricity - gCO2/kWh"]
              );
            });
            setRegions(entities);
            setCarbonIntensity(intensityMap);
          },
        });
      });
  }, []);

  const handleModelChange = (event) => setModel(event.target.value);
  const handleTaskChange = (event) => setTask(event.target.value);
  const handleGpuChange = (event) => setGpu(event.target.value);
  const handleRegionChange = (event, newValue) => setRegion(newValue);
  const handleEstimate = () => {
    if (
      !model ||
      !task ||
      !gpu ||
      !region ||
      !datasetSize ||
      !batchSize ||
      !numEpochs
    ) {
      setOpenDialog(true);
      return;
    }

    if (model === "Gemma-7B" && gpu !== "A100") {
      setEstimation(
        <Box>
          <Card className="transparent-card">
            <CardContent>
              <Typography>
                Gemma-7B requires an <b>A100 GPU</b> for fine-tuning. Please
                select A100 to view emissions data.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      );
      return;
    }

    const intensity = carbonIntensity[region?.label] || 0;
    const runtime =
      (datasetSize / batchSize) *
      numEpochs *
      timePerBatchData[model][task][gpu];
    const energy = (powerData[gpu] * runtime) / 3600000;
    const emissions = energy * intensity;
    const emissions_rate = emissions / runtime;
    setEstimation(
      <div>
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
              {energy.toFixed(3)}
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
              {emissions.toFixed(2)}
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
              {emissions_rate.toFixed(3)}
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
              {(runtime / 60).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </div>
    );
  };

  const models = ["LLaMA-2-7B", "Mistral-7B", "Gemma-2B", "Gemma-7B"];
  const tasks = [
    "Question Answering",
    "Text Summarisation",
    "Sentiment Analysis",
  ];
  const gpus = ["T4", "L4", "A100"];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Emissions Estimation
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: "1.2rem", paddingBottom: 3 }}
        gutterBottom
      >
        Fill out the following parameters to roughly estimate your training
        emissions.
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
              <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
                <ListItemText primary="Estimates are based on GPU power consumption and processing time per batch data, derived from experiments." />
              </ListItem>
              <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
                <ListItemText primary="Runtime is computed as dataset size / batch size × processing time per batch × number of epochs." />
              </ListItem>
              <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
                <ListItemText primary="Energy consumption is calculated as power × runtime." />
              </ListItem>
              <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
                <ListItemText
                  primary={
                    <>
                      CO₂ emissions are derived as carbon intensity × energy,
                      using region-specific carbon intensity values from{" "}
                      <Typography
                        component="a"
                        href="https://ourworldindata.org/grapher/carbon-intensity-electricity"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="#ffffff"
                        sx={{ textDecoration: "underline" }}
                      >
                        Our World in Data
                      </Typography>
                      .
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
                <ListItemText primary="Results provide an approximation and may vary depending on workload conditions." />
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
              color: "white", // White text in the dropdown
              ".MuiSvgIcon-root": {
                color: "white", // White color for dropdown icon
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)", // White outline
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline when focused
              },
            }}
          >
            <MenuItem value="">Select Model</MenuItem>
            {models.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
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
              color: "white", // White text in the dropdown
              ".MuiSvgIcon-root": {
                color: "white", // White color for dropdown icon
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)", // White outline
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline when focused
              },
            }}
          >
            <MenuItem value="">Select Task</MenuItem>
            {tasks.map((task) => (
              <MenuItem key={task} value={task}>
                {task}
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
              color: "white", // White text in the dropdown
              ".MuiSvgIcon-root": {
                color: "white", // White color for dropdown icon
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)", // White outline
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline when focused
              },
            }}
          >
            <MenuItem value="">Select GPU</MenuItem>
            {gpus.map((gpu) => (
              <MenuItem key={gpu} value={gpu}>
                {gpu}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <Autocomplete
            options={regions}
            value={region}
            onChange={handleRegionChange}
            getOptionLabel={(option) => {
              console.log("Option passed to getOptionLabel:", option);
              return option && option.label ? option.label : "Unknown";
            }}
            displayEmpty
            sx={{
              color: "white", // White text in the dropdown
              input: { color: "white" },
              "& .MuiInputLabel-root": { color: "white" }, // White label text
              ".MuiOutlinedInput-root": {
                ".MuiSvgIcon-root": {
                  color: "white", // White color for dropdown icon
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)", // White outline
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", // White outline on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", // White outline when focused
                },
              },
            }}
            renderInput={(params) => (
              <TextField {...params} label="Region of Compute" fullWidth />
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Dataset Size"
            type="number"
            value={datasetSize}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value)); // Ensure value is at least 1
              setDatasetSize(value);
              if (batchSize > value) {
                setBatchSize(value);
              }
            }}
            displayEmpty
            sx={{
              input: { color: "white" }, // White text inside the field,
              "& .MuiInputLabel-root": { color: "white" }, // White label text
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)", // White outline
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline when focused
              },
            }}
            fullWidth
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Batch Size"
            type="number"
            value={batchSize}
            onChange={(e) => {
              let value = Math.max(1, Number(e.target.value)); // Ensure value is at least 1
              if (value > datasetSize) {
                value = datasetSize;
              }
              setBatchSize(value);
            }}
            displayEmpty
            sx={{
              input: { color: "white" }, // White text inside the field,
              "& .MuiInputLabel-root": { color: "white" }, // White label text
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)", // White outline
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline when focused
              },
            }}
            fullWidth
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Number of Epochs"
            type="number"
            value={numEpochs}
            onChange={(e) => {
              let value = Math.max(1, Number(e.target.value)); // Ensure value is at least 1
              setNumEpochs(value);
            }}
            displayEmpty
            sx={{
              input: { color: "white" }, // White text inside the field,
              "& .MuiInputLabel-root": { color: "white" }, // White label text
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)", // White outline
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // White outline when focused
              },
            }}
            fullWidth
          />
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleEstimate}
          sx={{
            textTransform: "none",
            backgroundColor: "#065387",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#012e58" },
            fontWeight: "bold",
          }}
        >
          ESTIMATE EMISSIONS
        </Button>
      </Box>
      <Box>{estimation}</Box>
      {/* Dialog for missing fields */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Missing Fields</DialogTitle>
        <DialogContent>
          <Typography>
            Please fill in all fields before estimating emissions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmissionsEstimation;

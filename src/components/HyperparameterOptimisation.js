import React from "react";
import "../App.css";
import { Box, Typography } from "@mui/material";

const HyperparameterOptimisation = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Hyperparameter Optimisation
    </Typography>
    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
      Batch Size: ...
    </Typography>
    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
      Learning Rate: ...
    </Typography>
    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
      Warmup Steps: ...
    </Typography>
    {/* Add further details as necessary */}
  </Box>
);

export default HyperparameterOptimisation;

import {
  TextField,
  Fab,
  Grid,
  Slider,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Button,
  Checkbox,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { question, setQuestion } from "./Create.js";
import React, { useState } from "react";
import {
  DEFAULT_TEXT,
  DEFAULT_CHOICES,
  DEFAULT_CHOICE,
  APP_DATA_TYPE,
} from "./constants";

function Slide({ leftText, setLeftText, rightText, setRightText }) {
  return (
    <div align="center">
      <Grid
        container
        direction={"column"}
        align="left"
        columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
      >
        <Grid item sx={{ pb: 2 }}>
          <Slider
            aria-label="Custom marks"
            defaultValue={20}
            valueLabelDisplay="auto"
            style={{ width: "75%" }}
          />
        </Grid>
        <Grid item sx={{ pb: 2 }}>
          <Grid
            container
            direction={"row"}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
          >
            <Grid item align="left">
              <TextField
                value={leftText}
                placeholder="Enter Field"
                label="Left Field"
                name="quiz text answer"
                variant="outlined"
                style={{ width: "50%" }}
                onChange={(t) => {
                  setLeftText(t.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                value={rightText}
                placeholder="Enter Field"
                label="Right Field"
                name="quiz text answer"
                variant="outlined"
                style={{ width: "50%" }}
                onChange={(t) => {
                  setRightText(t.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Slide;
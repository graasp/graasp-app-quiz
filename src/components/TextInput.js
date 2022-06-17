import {
  TextField,
  Fab,
  Grid,
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

function TextInput({ text, setText }) {
  return (
    <div align="center">
      <Grid
        container
        direction={"column"}
        align="left"
        columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
      >
        <Grid item sx={{ pb: 2 }}>
          <Typography variant="p1"> Type Answer here:</Typography>
        </Grid>
        <Grid item sx={{ pb: 2 }}>
          <TextField
            value={text}
            placeholder="Enter Answer"
            label="Answer"
            name="quiz text answer"
            variant="outlined"
            onChange={(t) => {
              {
                setText(t.target.value);
              }
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default TextInput;

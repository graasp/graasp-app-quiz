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
  Slider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { question, setQuestion } from "./Create.js";
import React, { useState } from "react";
import { useAppData } from "./context/hooks";
import {
  DEFAULT_TEXT,
  DEFAULT_CHOICES,
  DEFAULT_CHOICE,
  APP_DATA_TYPE,
} from "./constants";

function PlaySlider({ sliderValue, setSliderValue }) {
  const { data, isSuccess } = useAppData();
  const leftLabel = data?.get(0)?.data?.leftText;
  const rightLabel = data?.get(0)?.data?.rightText;
  const marks = [
    { value: 0, label: `${leftLabel}` },
    {
      value: 100,
      label: `${rightLabel}`,
    },
  ];

  // TODO: outlined color once selected
  function computeCorrectness(index) {
    if (choices[index].isCorrect !== answers[index]) {
      return "false";
    } else if (choices[index].isCorrect && answers[index]) {
      return "true";
    } else {
      return "neutral";
    }
  }

  return (
    <div>
      <Grid container direction={"column"} sx={{ p: 2 }}>
        <Grid item sx={{ pb: 2 }}>
          <Slider
            aria-label="Custom marks"
            defaultValue={50}
            valueLabelDisplay="auto"
            value={sliderValue}
            onChange={(e, val) => {
              setSliderValue(val);
            }}
            marks={marks}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default PlaySlider;

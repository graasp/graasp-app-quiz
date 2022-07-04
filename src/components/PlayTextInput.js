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
import { alpha, styled } from "@mui/material/styles";

function PlayTextInput({ text, setText, answer, submitted }) {
  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "green",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
      },
      "&:hover fieldset": {
        borderColor: "yellow",
      },
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
    },
  });

  const ValidationTextField = styled(TextField)({
    "& input:valid + fieldset": {
      borderColor: "green",
      borderWidth: 2,
    },
    "& input:invalid + fieldset": {
      borderColor: "red",
      borderWidth: 2,
    },
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 6,
      padding: "4px !important", // override inline-style
    },
  });

  // TODO: outlined color once selected
  function answerIsCorrect() {
    return answer.toLowerCase() === text.toLowerCase();
  }

  return (
    <div>
      <Grid container direction={"column"} alignItems="center" sx={{ p: 2 }}>
        <Grid item sx={{ pb: 2 }}>
          <Typography variant="p1"> Type Answer here:</Typography>
        </Grid>
        {(() => {
          if (!submitted) {
            return (
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
            );
          }

          if (answerIsCorrect()) {
            return (
              <TextField
                label="Correct"
                required
                variant="outlined"
                defaultValue={text}
                color="success"
                focused
                inputProps={{ readOnly: true }}
                id="validation-outlined-input"
              />
            );
          }

          return (
            <TextField
              error
              id="outlined-error-heper-text"
              label="Incorrect"
              defaultValue={text}
              helperText={`Correct Answer: ${answer}`}
              focused
              inputProps={{ readOnly: true }}
            />
          );
        })()}
      </Grid>
    </div>
  );
}

export default PlayTextInput;

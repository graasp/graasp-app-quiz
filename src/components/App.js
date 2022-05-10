import { TextField, Fab, Grid, InputLabel, OutlinedInput, InputAdornment, IconButton, VisibilityOff, FormControl, FormLabel, FormControlLabel, Button, Checkbox, Typography, Stepper, Step, StepLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Visibility from '@mui/icons-material/Visibility'
import React, { useState } from "react"

function App() {
  const [question, setQuestion] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");

  var choiceList = []
  choiceList.push([choice1, setChoice1])
  choiceList.push([choice2, setChoice2])

  //const [answers, setAnswers] = useState([{ value: 'it is answer 1', checked: false }])

  const [answers, setAnswers] = React.useState({
    answer1: false,
    answer2: false,
  });

  const { answer1, answer2 } = answers;

  const handleAnswerCorrectnessChange = (event) => {
    setAnswers({ ...answers, [event.target.name]: event.target.checked });
  };


  return (
    <div align="center">
      <Grid container direction={"row"} alignItems="center" sx={{ p: 2 }}>
        <Stepper alternativeLabel activeStep={0} align="center">
          <Step>
            <StepLabel>Question 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>Question 2</StepLabel>
          </Step>
          <Step completed>
            <StepLabel>Question 3</StepLabel>
          </Step>
        </Stepper>
      </Grid>
      <Typography variant="h1" fontSize={40} sx={{ pb: 4 }}> Create your quiz </Typography>
      <Grid container direction={"column"} spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} align="left">
        <Grid item xs={6} align="left">
          <Typography variant="p1"> Question:</Typography>
        </Grid>
        <Grid item align="left">

          <TextField
            value={question}
            placeholder="Enter Question"
            label="Question"
            name="quizQuestion"
            variant="outlined"
            onChange={t => {
              setQuestion(t.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6} align="left">
          <Typography variant="p1"> Answers:</Typography>
        </Grid>
        <Grid item>
          <Typography variant="ch1"> Enter Choice 1:</Typography>
        </Grid>
        <Grid item>
          <OutlinedInput
            id="outlined-adornment-password"
            type={'text'}
            label="Choice 1"
            value={choice1}
            onChange={t => {
              setChoice1(t.target.value)
            }}
            endAdornment={
              <InputAdornment position="end">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answer1}
                      onChange={handleAnswerCorrectnessChange}
                      name="answer1"
                      edge="end"
                    />
                  }
                />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item>
          <Typography variant="ch2"> Enter Choice 2:</Typography>
        </Grid>
        <Grid item>
          <OutlinedInput
            id="outlined-adornment-password"
            type={'text'}
            label="Choice 2"
            value={choice2}
            onChange={t => {
              setChoice2(t.target.value)
            }}
            endAdornment={
              <InputAdornment position="end">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answer2}
                      onChange={handleAnswerCorrectnessChange}
                      name="answer2"
                      edge="end"
                    />
                  }
                />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item sx={{ pt: 2 }} align="left">
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Grid>
        <Grid container direction={"row"} spacing={2} sx={{ py: 2 }} align="center">
          <Grid item sx={{ pr: 5 }}>
            <Button variant="contained" color="info">
              Prev
            </Button>
          </Grid>
          <Grid item sx={{ pr: 5 }}>
            <Button variant="contained" color="success">
              Save
            </Button>
          </Grid>
          <Grid item >
            <Button variant="contained" color="info">
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div >
  );
}

export default App;

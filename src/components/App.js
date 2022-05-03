import { TextField, Grid, FormControl, FormLabel, FormControlLabel, Button, Checkbox, Typography } from '@mui/material'
import React, { useState } from "react"

function App() {
  const [question, setQuestion] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");
  const [choice4, setChoice4] = useState("");

  //const [answers, setAnswers] = useState([{ value: 'it is answer 1', checked: false }])

  const [answers, setAnswers] = React.useState({
    answer1: false,
    answer2: false,
    answer3: false,
    answer4: false
  });

  const { answer1, answer2, answer3, answer4 } = answers;

  const handleAnswerCorrectnessChange = (event) => {
    setAnswers({ ...answers, [event.target.name]: event.target.checked });
  };


  return (
    <div align="center">
      <h1> Create your quiz </h1>
      <Grid container direction={"column"} spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Grid item xs={6} align="left">
          <p1> Enter Question 1:</p1>
        </Grid>
        <Grid item align="left">
          
          <TextField
            value={question}
            placeholder="Enter Question"
            label="Quiz question"
            name="quizQuestion"
            variant="outlined"
            onChange={t => {
              setQuestion(t.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6}>
            <FormLabel component="legend" id="correct answer">Answers: </FormLabel>
            <Grid item sx={{ py: 2 }}>
              <Grid container direction={"row"} spacing={20}>
                <Grid item>
                  <Typography variant="ch1"> Enter Choice 1:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="cr"> Correct Answer:</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction={"row"} spacing={9} alignItems="center">
              <Grid item>
                <TextField
                  value={choice1}
                  placeholder="Enter Choice 1"
                  label="Choice 1"
                  name="Choice 1"
                  variant="outlined"
                  onChange={t => {
                    setChoice1(t.target.value)
                  }}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answer1}
                      onChange={handleAnswerCorrectnessChange}
                      name="answer1"
                    />
                  }
                />
              </Grid>
            </Grid>

            <Grid item sx={{ py: 2, mr: 35 }}>
              <Typography variant="ch2"> Enter Choice 2:</Typography>
            </Grid>
            <Grid container direction={"row"} spacing={9} alignItems="center">
              <Grid item>
                <TextField
                  value={choice2}
                  placeholder="Enter Choice 2"
                  label="Choice 2"
                  name="Choice 2"
                  variant="outlined"
                  onChange={t => {
                    setChoice2(t.target.value)
                  }}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answer2}
                      onChange={handleAnswerCorrectnessChange}
                      name="answer2"
                    />
                  }
                />
              </Grid>
            </Grid>

            <Grid item sx={{ py: 2, mr: 35 }}>
              <Typography variant="ch3"> Enter Choice 3:</Typography>
            </Grid>
            <Grid container direction={"row"} spacing={9} alignItems="center">
              <Grid item>
                <TextField
                  value={choice3}
                  placeholder="Enter Choice 3"
                  label="Choice 3"
                  name="Choice 3"
                  variant="outlined"
                  onChange={t => {
                    setChoice3(t.target.value)
                  }}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answer3}
                      onChange={handleAnswerCorrectnessChange}
                      name="answer3"
                    />
                  }
                />
              </Grid>
            </Grid>

            <Grid item sx={{ py: 2, mr: 35 }}>
              <Typography variant="ch4"> Enter Choice 4:</Typography>
            </Grid>
            <Grid container direction={"row"} spacing={9} alignItems="center">
              <Grid item>
                <TextField
                  value={choice4}
                  placeholder="Enter Choice 4"
                  label="Choice 4"
                  name="Choice 4"
                  variant="outlined"
                  onChange={t => {
                    setChoice4(t.target.value)
                  }}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answer4}
                      onChange={handleAnswerCorrectnessChange}
                      name="answer4"
                    />
                  }
                />
              </Grid>
            </Grid>
          <Grid item sx={{ py: 2 }}>
            <Button variant="contained" color="success">
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div >
  );
}

export default App;

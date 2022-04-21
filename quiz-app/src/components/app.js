// import './App.css';
import { TextField, Grid, FormControl, FormLabel, FormControlLabel, Button, Checkbox } from '@mui/material'
import React, { useState } from "react"

function App() {
  const [question, setQuestion] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");
  const [choice4, setChoice4] = useState("");

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
    <div className="Quiz_App" align="center">
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
            name="Quiz Question"
            variant="outlined"
            onChange={t => {
              setQuestion(t.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend" id="correct answer">Answers: </FormLabel>
              <Grid item sx={{ py: 2 }}>
                <Grid container direction={"row"} spacing={20}>
                  <Grid item>
                    <p12> Enter Choice 1:</p12>
                  </Grid>
                  <Grid item>
                    <p22> Correct Answer:</p22>
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
                <p2> Enter Choice 2:</p2>
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
                <p3> Enter Choice 3:</p3>
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
                <p4> Enter Choice 4:</p4>
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
          </FormControl>
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

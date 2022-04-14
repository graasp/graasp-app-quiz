// import './App.css';
import { TextField, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, spacing } from '@mui/material'
import React, { useState } from "react"

function App() {
  const [value, setValue] = useState("");
  const [option1, setValue2] = useState("");
  const [option2, setValue3] = useState("");
  const [option3, setValue4] = useState("");
  const [option4, setValue5] = useState("");
  const [correctAns, setCorrectAns] = useState("");


  return (
    <div className="Quiz_App" align="center">
      <h1> Create your quiz </h1>
      <Grid container direction={"column"} spacing={2}>
        <Grid item xs={6}>
          <p1> Enter Question 1:</p1>
        </Grid>
        <Grid item>
          <TextField
            value={value}
            placeholder="Enter Question"
            label="Quiz question"
            name="Quiz Question"
            variant="outlined"
            onChange={t => {
              setValue(t.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <Grid item sx={{ py: 2 }}>
              <p1> Enter Choice 1:</p1>
            </Grid>
            <TextField
              value={option1}
              placeholder="Enter Choice 1"
              label="Choice 1"
              name="Choice 1"
              variant="outlined"
              onChange={t => {
                setValue2(t.target.value)
              }}
            />
            <FormLabel component="legend" id="correct answer">Answers: </FormLabel>
            <RadioGroup aria-labelledby="correct answer" name="correct answer" checked={correctAns} onChange={event => {
              console.log(event.target.checked)
              setCorrectAns(event.target.checked)
            }}>
              <FormControlLabel value="1" control={<Radio />} label="correct answer" />

              <Grid item sx={{ py: 2 }}>
                <p2> Enter Choice 2:</p2>
              </Grid>
              <TextField
                value={option2}
                placeholder="Enter Choice 2"
                label="Choice 2"
                name="Choice 2"
                variant="outlined"
                onChange={t => {
                  setValue3(t.target.value)
                }}
              />

              <FormControlLabel value="2" control={<Radio />} label="correct answer" />

              <Grid item sx={{ py: 2 }}>
                <p3> Enter Choice 3:</p3>
              </Grid>
              <TextField
                value={option3}
                placeholder="Enter Choice 3"
                label="Choice 3"
                name="Choice 3"
                variant="outlined"
                onChange={t => {
                  setValue4(t.target.value)
                }}
              />

              <FormControlLabel value="3" control={<Radio />} label="correct answer" />
              <Grid item sx={{ py: 2 }}>
                <p4> Enter Choice 4:</p4>
              </Grid>
              <TextField
                value={option4}
                placeholder="Enter Choice 4"
                label="Choice 4"
                name="Choice 4"
                variant="outlined"
                onChange={t => {
                  setValue5(t.target.value)
                }}
              />
              <FormControlLabel value="4" control={<Radio />} label="correct answer" />
            </RadioGroup>
          </FormControl>
          <Grid item sx={{ py: 2, ml: 22 }}>
            <Button variant="contained" color="success">
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

import { TextField, Fab, Grid, InputLabel, OutlinedInput, IconButton, InputAdornment, FormControl, FormControlLabel, Button, Checkbox, Typography, Stepper, Step, StepLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from "react"
import { DEFAULT_QUESTION, DEFAULT_CHOICES, DEFAULT_CHOICE, APP_DATA_TYPE } from './constants'
import { useAppData } from './context/hooks'
import { MUTATION_KEYS, useMutation } from '../config/queryClient'

function App() {
  const { data } = useAppData()
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA)

  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [choices, setChoices] = useState(DEFAULT_CHOICES);

  const handleAnswerCorrectnessChange = (index, e) => {
    let newChoices = [...choices]
    newChoices[index] = { ...choices[index], isCorrect: e.target.checked }
    setChoices(newChoices)
  };

  const handleChoiceChange = (index, e) => {
    let newChoices = [...choices]
    newChoices[index] = { ...choices[index], choice: e.target.value }
    setChoices(newChoices)
  }

  const addAnswer = () => {
    setChoices([...choices, DEFAULT_CHOICE])
  }

  const removeAnswer = (index) => {
    let newChoices = [...choices]
    newChoices.splice(index, 1)
    setChoices(newChoices)
  }

  const onSave = () => {
    postAppData({
      id: data?.get(0).id,
      data: {
        question: question,
        choices: choices
      },
      type: APP_DATA_TYPE
    })
  }

  const readableIndex = (index => index + 1)

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
      <Grid container direction={"column"} align="left" columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} align="left">
        <Grid item sx={{ pb: 2 }}>
          <Typography variant="p1"> Question:</Typography>
        </Grid>
        <Grid item sx={{ pb: 2 }}>

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
        <Grid item>
          <Typography variant="p1"> Answers:</Typography>
        </Grid>
        {choices.map((choice, index) => (
          <div key={index}>
            <Grid container direction={"column"} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} align="left">
              <Grid item sx={{ pt: 2 }}>
                <Typography> Enter Choice {readableIndex(index)}:</Typography>
              </Grid>
              <Grid container direction={"row"}>
                <Grid item variant="outlined" sx={{ pt: 2 }}>
                  <FormControl variant="outlined">
                    <InputLabel >Choice {readableIndex(index)}</InputLabel>
                    <OutlinedInput
                      type={'text'}
                      label={`Choice ${readableIndex(index)}`}
                      value={choice.choice}
                      placeholder={`Enter Choice ${readableIndex(index)}`}
                      onChange={(e) => handleChoiceChange(index, e)}
                      endAdornment={
                        <InputAdornment position="end">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={choices[index].isCorrect}
                                onChange={(e) => handleAnswerCorrectnessChange(index, e)}
                                name="answer"
                                edge="end"
                              />
                            }
                          />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item sx={{ pt: 2.75, pl: 1 }}>
                  {
                    index > 1 ?
                      <IconButton type="button" onClick={() => removeAnswer(index)}>
                        <CloseIcon />
                      </IconButton>
                      : null
                  }
                </Grid>
              </Grid>
            </Grid>
          </div>
        ))}


        <Grid item sx={{ pt: 2 }} align="left">
          <Fab color="primary" aria-label="add" onClick={addAnswer}>
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
            <Button onClick={onSave} variant="contained" color="success">
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

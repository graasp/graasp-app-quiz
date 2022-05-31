import { TextField, Fab, Grid, Box, InputLabel, OutlinedInput, IconButton, MenuItem, InputAdornment, FormControl, FormControlLabel, Button, Checkbox, Typography, Stepper, Step, StepLabel, Select } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from "react"
import { DEFAULT_QUESTION, DEFAULT_CHOICES, DEFAULT_CHOICE, APP_DATA_TYPE } from './constants'
import { useAppData } from './context/hooks'
import { MUTATION_KEYS, useMutation } from '../config/queryClient'
import MultipleChoice from './MultipleChoice'
import TextInput from './TextInput'

function Create() {
  const { data } = useAppData()
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA)

  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [type, setType] = useState('Multiple Choice')

  const handleTypeSelect = (event) => {
    setType(event.target.value)
  }

  const onSave = () => {
    postAppData({
      id: data?.get(0).id,
      data: {
        question: question,
        choices: [] //choices
      },
      type: APP_DATA_TYPE
    })
  }

  return (
    <div align="center">
      <Grid container direction={"column"} alignItems="center" sx={{ p: 2 }}>
        <Stepper alternativeLabel activeStep={1}>
          <Step completed>
            <StepLabel>Question 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>Question 2</StepLabel>
          </Step>
          <Step>
            <StepLabel>Question 3</StepLabel>
          </Step>
        </Stepper>
      </Grid>
      <Typography variant="h1" fontSize={40} sx={{ pb: 4 }}> Create your quiz </Typography>
      <Grid container direction={"column"} align="left" columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Grid item sx={{ pb: 2 }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Type"
                onChange={handleTypeSelect}
              >
                <MenuItem value={'Multiple Choice'}>Multiple Choice</MenuItem>
                <MenuItem value={'Text Input'}>Text Input</MenuItem>
                <MenuItem value={'Slider'}>Slider</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
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
        {
          {
            'Multiple Choice': <MultipleChoice/>,
            'Text Input': <TextInput/>
          }[type]
        }
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

export default Create;

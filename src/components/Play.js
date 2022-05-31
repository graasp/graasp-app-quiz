import { TextField, Fab, Grid, InputLabel, OutlinedInput, IconButton, InputAdornment, FormControl, FormControlLabel, Button, Checkbox, Typography, Stepper, Step, StepLabel } from '@mui/material'
import React, { useState } from "react"
import { DEFAULT_QUESTION, DEFAULT_CHOICES, DEFAULT_CHOICE, APP_DATA_TYPE } from './constants'
import { useAppData } from './context/hooks'
import { MUTATION_KEYS, useMutation } from '../config/queryClient'
import { HdrOnSelectRounded } from '@mui/icons-material'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        secondary: {
            main: '#1d0088'
        }
    },
});

function Play() {
    const { data, isSuccess } = useAppData()
    const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA)

    const question = data?.get(0).data.question
    const choices = data?.get(0).data.choices
    const [answers, setAnswers] = React.useState(Array(choices.length).fill().map(() => false))
    const [results, setResults] = React.useState(Array(choices.length).fill().map(() => 'neutral'))
    const [submitted, setSubmitted] = React.useState(false)

    const onSubmit = () => {
        setSubmitted(!submitted)
        postAppData({
            id: data?.get(1).id,
            data: {
                answers: answers
            },
            type: 'answer'
        })
        let newResults = []
        for (let i = 0; i < results.length; i++) {
            newResults[i] = computeCorrectness(i)
        }
        console.log(newResults)
        setResults(newResults)
        console.log(results)
    }

    const onSelect = (index) => {
        let newAnswers = [...answers]
        newAnswers[index] = !answers[index]
        setAnswers(newAnswers)
    }

    function computeCorrectness(index) {
        if (choices[index].isCorrect !== answers[index]) {
            return 'false'
        } else if (choices[index].isCorrect && answers[index]) {
            return 'true'
        } else {
            return 'neutral'
        }
    }

    function selectColor(index) {
        if (submitted) {
            switch (results) {
                case 'true': return "success"
                case 'false': return "error"
                default: return "primary"
            }
        } else {
            return answers[index] ? "secondary" : "primary"
        }
    }

    return (
        <div>
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
            <Typography variant="h1" fontSize={45} sx={{ pb: 4 }}> {question} </Typography>
            {choices?.map((choice, index) => (
                <div key={index}>
                    <Grid container direction={"column"} sx={{ pb: 3 }} align="center" columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                        <Grid item sx={{ py: 3 }}>
                            <ThemeProvider theme={theme}>
                                <Button key={index} onClick={() => onSelect(index)} variant="contained" className="answerButton" color={selectColor(index)} fullWidth sx={{ py: 2 }}>
                                    {choice.choice}
                                </Button>
                            </ThemeProvider>
                        </Grid>
                    </Grid>
                </div>
            ))}
            <Grid container direction={"row"} spacing={2} sx={{ pt: 2 }} alignItems="center">
                <Grid item sx={{ pr: 20 }}>
                    <Button variant="contained" color="info">
                        Leave
                    </Button>
                </Grid>
                <Grid item sx={{ pr: 20 }}>
                    <Button onClick={onSubmit} variant="contained" color="success">
                        Submit
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="info">
                        Skip
                    </Button>
                </Grid>
            </Grid>
        </div>

    )
}

export default Play;
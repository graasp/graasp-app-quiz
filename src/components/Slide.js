import { TextField, Fab, Grid, Slider, InputLabel, OutlinedInput, IconButton, InputAdornment, FormControl, FormControlLabel, Button, Checkbox, Typography, Stepper, Step, StepLabel, Select } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { question, setQuestion } from './Create.js'
import React, { useState } from "react"
import { DEFAULT_QUESTION, DEFAULT_CHOICES, DEFAULT_CHOICE, APP_DATA_TYPE } from './constants'

function Slide() {
    const [textLeft, setTextLeft] = useState('')
    const [textRight, setTextRight] = useState('')

    const marks = [
        {value: 0,
        label: 'happy'},
        {
            value: 100,
            label: 'sad'
        }
    ]

    return (
        < div align="center" >
            <Grid container direction={"column"} align="left" columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <Grid item sx={{ pb: 2 }}>
                        <Slider
                            aria-label="Custom marks"
                            defaultValue={20}
                            getAriaValueText={"hey"}
                            step={10}
                            valueLabelDisplay="auto"
                            marks={marks}
                        />
                </Grid>
                <Grid item sx={{ pb: 2 }}>
                <Grid container direction={"row"} align="left" columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>

                    <TextField
                        value={textLeft}
                        placeholder="Enter Answer"
                        label="Answer"
                        name="quiz text answer"
                        variant="outlined"
                        onChange={t => {
                            setTextLeft(t.target.value)
                        }}
                    />
                    </Grid>
                </Grid>
            </Grid>
        </div >
    )
}

export default Slide;
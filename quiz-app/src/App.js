import './App.css';
import {TextField} from '@mui/material'
import React, { useState } from "react"

function App() {
  const [value, setValue] = useState("");

  return (
    <div className="Quiz_App" align = "center">
      <h1> Create your quiz </h1>
      <TextField 
      value = {value}
      placeholder="Enter Question"
      label="Quiz question"
      name = "Quiz Question"
      variant = "outlined"
      onChange= {t => {
        setValue(t.target.value)
      }}
      />
    </div>
  );
}

export default App;

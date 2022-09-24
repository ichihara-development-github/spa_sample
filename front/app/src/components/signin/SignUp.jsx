import { NewEmployeeForm } from '../../components/employees/NewEmployeeForm';
import { useState } from 'react';
import { Box, TextField, Step, StepLabel, Stepper, Stack, Button, Typography } from "@mui/material"
import React from "react"
import { REQUEST_STATUS } from '../const';
import { NewOrganizationForm } from './OrganizationForm';


const steps = [
    '責任者アカウント作成',
    '組織作成',
    '従業員登録',
  ];

export const SignUp = () => {
    const [stepIndex, setStepIndex] = useState(0);
　  const [empParams, setEmpParams] = useState();
   
    const sendEmployeeParams = (params) => {
        setEmpParams(params)
        setStepIndex(1)
    }



    const stepComponents = [ 
        <NewEmployeeForm 
            sendParams={sendEmployeeParams}
            requestStatus={REQUEST_STATUS.OK}
             />,
        <NewOrganizationForm empParams={empParams} />,
        <NewEmployeeForm/>]
      
    return (
        <Box>
                  
        <Stepper 
            activeStep={stepIndex} 
            alternativeLabel
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                  {label}
              </StepLabel> 
            </Step>
          ))}
          </Stepper>
        {stepComponents[stepIndex]}
      
        </Box>
        
    )
}
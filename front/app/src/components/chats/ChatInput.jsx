import React, { useContext, useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { Box, InputBase, Stack, TextField } from "@mui/material";

export const ChatInput = ({selected, sendMessage}) => {


  const [text, setText] = useState();
  
  const handleChange = (e) => {
    setText(e.target.value)
  }
  
  const Submit = (e) => {
    
    e.preventDefault();
    if(!text){return}
    sendMessage(selected.id, text);
    setText(null);
    document.getElementById("chatInput").value="";
  }


  return (
    <Box sx={{width: "100%"}}>
     <form 
      onSubmit={Submit} 
      style={{position:"flexed", bottom:0}}
     >
       <Stack 
        sx={{py:2}}
        direction="row" 
        spacing={1} 
        alignItems="center"
        >
          <TextField
            id="chatInput"
            required
            style={{width:"calc(100% - 50px)"}}
            onChange={handleChange} 
        /> 
         <IconButton 
          type="submit"
          color="primary" 
          component="button"
          >
         <SendIcon/>
          </IconButton>

       </Stack>

   
        
    </form>

     </Box>
    
  

  )

}
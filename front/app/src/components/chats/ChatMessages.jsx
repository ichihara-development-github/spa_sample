import { Box, Stack } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";

import ChatTemplate from "./ChatTemplate"

export const ChatMessages = ({
    messages, 
    selected, 
    cancelSend ,
    tempId,
}) => {



    return (
        <Box  sx={{paddingTop: 7,height:"100%",overflow: "scroll"}}>
             {messages.map((message, index) => {

                const side = message.employee_id === tempId ? "right" : "left";
                const time = `${("00" + new Date(message.created_at).getHours()).slice(-2)} :
                ${("00" + new Date(message.created_at).getMinutes()).slice(-2)}`

                return (
                <div key={index}>
                     <ChatTemplate
                        message={message}
                        roomId={selected.id}
                        side={side}
                        time={time}
                        cancelSend={cancelSend}
                    />
                </div>
                )
                })}

        </Box>)

}
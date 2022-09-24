import React, { Fragment, useEffect, useState, useReducer, useContext } from 'react';

import { ChatMessages } from '../components/chats/ChatMessages'
import { ChatInput } from '../components/chats/ChatInput';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Chip, CircularProgress, Drawer, ListItemAvatar, Switch } from '@mui/material';
import { fetchMessages, createMessage, deleteMessage } from '../apis/chat';
import Stack from '@mui/material/Stack';
import { ChatReducer, initialState } from '../reducers/chat';
import { FormControlLabel, FormGroup } from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';

import { Avatar, ListItem, ListItemText } from "@mui/material"

import MainImage from '../images/cake.jpeg';

import {io} from "socket.io-client"
import Typography from '@mui/material/Typography';
import { fetchRooms } from '../apis/room';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { AuthContext } from '../contexts/auth';
import { AddChatRoom } from '../components/chats/AddChatRoom';
import { gridColumnGroupsLookupSelector } from '@mui/x-data-grid';
import { convertLength } from '@mui/material/styles/cssUtils';

const welcomeStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, 0)',
  height: 400,
  maxWidth: "95%",
 
}

const drawerWidth = 240;
const responsiveWidth = window.innerWidth > 768 ? drawerWidth : 0;


export const Chat = () => {
 
const [state, dispatch] = useReducer(ChatReducer, initialState);

const [rooms, setRooms] = useState([]);
const [selected, setSelected] = useState({id: "",name:""});
const [open, setOpen] = useState(responsiveWidth !== 0);
const [tempId, setTempid] = useState()
const auth = useContext(AuthContext);
const history = useHistory();


// const socket = io(`${process.env.SOCKET_DOMAIN}:5500`)

  const sendMessage = (id, content) => {
    
   
    createMessage(id, content)
    .then(res => {
      console.log(res)
      // socket.emit("SEND_MESSAGE", res.data.message);
      // joinedSocket.emit("SEND_PUSH", res.data.message);
      dispatch({
        type: "ADD",
        message: res.data.message
      })

    })
    .catch(e => console.log(e))
  }

  
  const cancelSend = (roomId, id) => {

    if(window.confirm("メッセージの送信を取り消しますか？")){

    deleteMessage(roomId, id)
    .then(res => {
      if(res.status !== 200){return}
      dispatch({
        type: "REMOVE",
        id: id
      })
      // socket.emit("CANCEL_MESSAGE", roomId, id);
    })

  }
  
  }


  const handleSelect = (id) => {
    dispatch({type: "FETCHING"})
    fetchMessages(id)
    .then((res) => {
      // socket.emit("leave", selected.id)
      setSelected({id: id, name: res.data.companion})
      // socket.emit("join", id)
      dispatch({
        type: "FETCH_END", 
        payload: res.data.messages})
    })
  }
 

  const handleTransition = (path) => {
    history.push(path)
  }
  
  // socket.on("RECIEVE_MESSAGE",(message)=>{
  //   console.log(message)
   
  //     dispatch({
  //       type: "ADD",
  //       message: message
  //     })
  // })

  // socket.on("REMOVE_MESSAGE",(id)=>{
  //   console.log("removed")
  //   dispatch({
  //     type: "REMOVE",
  //     id: id
  //   })
  // })

  useEffect(() => {

        
    fetchRooms()
    .then(res => {
      setRooms(res.data.rooms)
      setTempid(res.data.tempId)
    })


  return () => {
    setTempid("")
    // socket.disconnect()
  };
}, []);


return (
 
    <Box 
      sx={{p:1}}
      >   
      <AppBar
        position="fixed"
        style={{paddingLeft: `calc(${responsiveWidth}px + 16px)`}}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <h4>{selected.name}</h4>  
          <FormControlLabel
            control={
              <Switch onChange={()=>setOpen(!open)} checked={open} color="default"/>
            } 
            label="メニュー"
            labelPlacement="start" />   
          
        </Stack>
       
      </AppBar>
      
         <Drawer
           sx={{
            width: responsiveWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width:  drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
                
<ul id="messages"></ul>
      <List sx={{ width: '100%',height:"100%", bgcolor: 'background.paper'}}>
      　{auth.state.chief ?  
      <ListItem>
        <AddChatRoom setRooms={setRooms}/>
      </ListItem>
      :
      ""
      }
      {rooms.map((room, index) => (
        <div key={index}>
         <ListItem button onClick={()=>handleSelect(room.id)}>
          <ListItemAvatar>
          <Avatar
            src={room.image || MainImage}
            alt={room.name}
          />
        
          </ListItemAvatar>
          <ListItemText primary={room.name}/>
         </ListItem>
         <Divider variant="inset" component="li" />
        </div>
      )
      )}
      <ListItem style={{position:"absolute", bottom:10}}>
      {auth.state.chief ?
      
      <Button 
        fullWidth 
        color="success" 
        variant="outlined"
        onClick={()=> {handleTransition("/Dashboard")}}
      >
        管理画面へ
      </Button>

      :
      <Button 
        fullWidth 
        color="success" 
        variant="outlined"
        onClick={()=> {handleTransition("/employeeDashboard")}}
      >
        メニュー画面へ
      </Button>
      }
      </ListItem>

    </List>
        
    </Drawer>
    <Box style={{
        width: `calc(100% - ${responsiveWidth}px)`,
        marginLeft: `${responsiveWidth}px`
    }}
    >   
        
      {
        selected.id?
        <>

          {state.fetchState === "FETCHING"?
           <CircularProgress
              style={{width: "80px", height: "80px", margin: "180px auto"}}
              color="inherit"/>
              :
            <>
            <div style={{height: 450,maxWidth: 700}}>
            <ChatMessages 
              selected={selected}
              messages={state.messageList} 
              setMessage={dispatch}
              cancelSend={cancelSend}
              tempId={tempId}
            />
             
            <ChatInput
              selected={selected}
              sendMessage={sendMessage}
              />
            </div>
    
          </>
      }
      </>
     
      :
      <div style={welcomeStyle}>
         <ChatOutlinedIcon /> 
          <Typography variant="h5">
            ルームをクリックして会話を始めましょう！
          </Typography>
          
      </div>
      } 
      </Box>
      
    </Box>
    
  
);

  
}
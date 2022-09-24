// サーバー定義
const express = require("express");
const port = 5500;

var app = express()

var server = app.listen(port, function(){
    console.log("server is running")
})

const io = require("socket.io")(server, {
  cors:{origin: process.env.SOCKET_DOMAIN,
  methods: ["GET","POST"] },
})

const ENDPOINT1 = process.env.REACT_APP_SOCKET_ENDPOINT1
// const ENDPOINT2 =  process.env.REACT_APP_SOCKET_ENDPOINT2

const currentJoinRoom = io.of("/current");
// const joinedRoom = io.of("/joined");

//-----------------------------------

// io.on("connection", (socket) => { // ブラウザから接続されたときの処理
//     console.log("a user connected");
//     socket.on("disconnect", () => { // ブラウザが切断したときの処理
//         console.log("user disconnected");
//     });
// });

// const {Server} = require("socket.io")
// const express = require('express');

// const app = express();

// const server = require("http").createServer(app)

// // io = socket(server)

io.on("connection", function(socket){
    console.log(io.engine.clientsCount);

    socket.on("join",function(roomId){
        socket.join(`room_${roomId}`);
        console.log(`join to ${roomId}`)
        console.log(io.engine.clientsCount)
        console.log(io.of("/").adapter.rooms)
    });

    socket.on("leave", function(roomId){
        socket.leave(`room_${roomId}`)
        console.log("leave")
        console.log(socket.adapter.sids)
    })

    
    socket.on("SEND_MESSAGE",function(message){
        console.log(message)
        io.to(`room_${message.room_id}`).emit("RECIEVE_MESSAGE", message)
    });

    
    socket.on("CANCEL_MESSAGE",function(roomId,id){
        console.log("cancel send")
        io.to(`room_${roomId}`).emit("REMOVE_MESSAGE", id)
    });
    

    socket.on("disconnect", function(){
        console.log("disconnected");
        socket.disconnect();
    })
})


// // // joinedRoom.on("connection", function(socket){
// // //     socket.emit("getJoinedIds")
// // //     console.log("joined")

// // //     socket.on("reConnect", function(ids){
// // //         ids.map(id => socket.join(`room_${id}`))
// // //         console.log(socket.rooms)
// // //     })
   
// // //     socket.on("join",function(roomId){
// // //         socket.join(`room_${roomId}`);
// // //         console.log(socket.rooms)
      
// // //     })

// // //     socket.on("SEND_PUSH",function(message){
// // //         console.log("push")
// // //         console.log(socket.rooms)
// // //         socket.broadcast.to(`room_${message.room_id}`).emit("PUSH_MESSAGE", message)
// // //     })

// // // })

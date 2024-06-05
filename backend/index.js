const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes=require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");
const path = require("path");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes); 
app.use("/api/messages",messagesRoute); 

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

mongoose.connect(process.env.MONGO_URL
,{
}).then(()=>{
    console.log("DB connected successfully");
}).catch((err)=>{
    console.log(err);
})


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`)
});

const io = socket(server,{
    cors:{
        // origin:"https://chatapp-yt-c4h4.onrender.com",
        origin:"localhost:3000",
        methods: ["POST","GET"],
        credentials:true
    },
})

global.onlineUsers = new Map();
io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        global.onlineUsers.set(userId,socket.id);
    });
    let temp={};
    for(let key of onlineUsers.keys()){
        temp[key]=true;
    }
    io.sockets.emit("onlineUsers",temp);
   
    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket!=undefined){
            socket.to(sendUserSocket).emit("msg-received",data.message);
        }
    });

    socket.on("logout",(data)=>{
        const val = data._id;
        onlineUsers.delete(val);
        let temp={};
        for(let key of onlineUsers.keys()){
            temp[key]=true;
        }
        io.sockets.emit("onlineUsers",temp);
    });

    socket.on("disconnect", () => { 
        global.onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                global.onlineUsers.delete(key);
                return;
            }
        });
        let temp={};
        for(let key of onlineUsers.keys()){
            temp[key]=true;
        }
        io.sockets.emit("onlineUsers",temp);
        });
});
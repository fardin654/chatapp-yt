const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes=require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes); 
app.use("/api/messages",messagesRoute); 

mongoose.connect("mongodb+srv://fardinmd654:test%401234@cluster0.pzp0j03.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
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
        origin:"http://deploy-mern-1whq.vercel.app",
        // origin:"localhost:3000",
        methods: ["POST","GET"],
        credentials:true
    },
})

global.onlineUsers = new Map();
io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-received",data.message);
        }
    });
});
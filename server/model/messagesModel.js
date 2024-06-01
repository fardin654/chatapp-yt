const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
   message:{
        text:{
            type: String,
            required:true,
        }
    },
    Users:Array,
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},
    {
        timeStamps:true,
    }
    
   

);

module.exports = mongoose.model("Messages",messageSchema);
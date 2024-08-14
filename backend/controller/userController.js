const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req,res,next) => {
    try{
        const {username,email,password}=req.body;
        const usernameCheck = await User.findOne({username});
        const emailCheck = await User.findOne({email});
        if(usernameCheck)
            return res.json({msg:"Username already Used", status :false});
        if(emailCheck)   
            return res.json({msg:"Email already in use",status:false});

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailRegex.test(email)==false){
            return res.json({msg:"Email invalid",status:false});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            email,username,password:hashedPassword
        });
        delete user.password;
        return res.json({status:true,user});
    }catch(err){
        next(err);
    }

};

module.exports.login = async (req,res,next) => {
    try{
        const {username,password}=req.body;
        const user = await User.findOne({username});
        if(!user)
            return res.json({msg:"Incorrect Username or Password.", status :false});
        const isPasswordValid = await bcrypt.compare(password,user.password);  
        if(!isPasswordValid)   
            return res.json({msg:"Incorrect Username or Password.",status:false});

        delete user.password;
        
        return res.json({status:true,user});
    }catch(err){
        next(err);
    }

};

module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      console.log(userData);
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

module.exports.getAllUsers =async (req,res,next) => {
    try{
        const users = await User.find({_id:{$ne: req.params.id}}).select([
            "username","email","avatarImage","_id",
        ]);
        return res.json(users);
    }catch(err){
        next(err);
    }
}
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/intershala",{useNewUrlParser:true});

const userSchema={
    FirstName:String,
    LastName:String,
    Email:String,
    Password:String
};

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.sendFile(__dirname+"/views/login.html");
});

app.post("/",function(req,res){
    const email=req.body.email;
    const pass=req.body.pass;
    User.find(function(err,users){
        if(err){
            console.log(err);
        }
        else{
            users.forEach(function(user){
                if(user.Email==email&&user.Password==pass){
                    console.log("true");
                    const fname=user.FirstName;  
                    const lname=user.LastName; 
                    res.render("loggedin",{firstName:fname,lastName:lname}); 
                    res.sendFile(__dirname+"/views/loggedin.ejs");
                    return false;
                }
            })
            res.sendFile(__dirname+"/views/login.html");
        }
    })
});

app.post("/signup",function(req,res){
    res.sendFile(__dirname+"/views/signup.html");
});

app.post("/signupData",function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.e_mail;
    const pass=req.body.pass;
    const user=new User({
        FirstName:fname,
        LastName:lname,
        Email:email,
        Password:pass
    });
    user.save();
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("server is running");
});
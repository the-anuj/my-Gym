const express = require('express');
const app = express();
const path = require('path')
const userModel = require('./models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const PORT = 3000;


app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.render("index")
})

app.get('/signup',(req,res)=>{
    res.render('register.ejs')
})

app.post('/signup',async(req,res)=>{
    let {name,email,contact,age,password}=req.body;
    let user = await userModel.findOne({email});
    if(user) return res.redirect('/signin')
        
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async(err,hash)=>{
            let createdUser = await userModel.create({
                name,
                email,
                contact,
                age,
                password:hash
            })
            let token = jwt.sign({user},"secret")
            res.cookie("token",token)
            res.status(200).redirect("/");
        })
    }) 
})

app.get('/signin',(req,res)=>{
    res.render("signin")
})
app.post('/signin', async(req,res)=>{
    let {email,password } = req.body
    let user = await userModel.findOne({email});
    if(!user) return res.send("something went wrong")
        else{
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                let token = jwt.sign({user},"secret")
                res.cookie("token",token)
                return res.status(200).redirect("/")
            }else{
                res.send("something went wrong")
            }
        })
    }
})

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/signup')
})

app.get('/profile',isLoggedIn,(req,res)=>{
    res.render('profile',{data:req.user});
})

function isLoggedIn(req,res,next){
    if(req.cookies.token===""){
        res.redirect('/signin')
        next()
    }else{
        let data = jwt.verify(req.cookies.token,"secret");
        req.user = data;
        next();
    }
}
app.listen(PORT);
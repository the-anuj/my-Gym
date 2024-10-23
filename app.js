const express = require('express');
const app = express();
const path = require('path')
const PORT = 3000;


app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>[
    res.render("index")
])

app.get('/sinup',(req,res)=>{
    res.render('register.ejs')
})

app.listen(PORT);
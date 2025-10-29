const express = require("express");
const app =express();

const ExpHandlebars =require ("express-handlebars");
const bodyParser =require ("body-parser");
const mysql =require ("mysql");

require('dotenv').config();

const port = process.env.port || 3000;

//read json data ans form data called middleware
// app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//error
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional (for form data)


//Static files import
app.use(express.static("public"));

//Template Engine
//"hbs"-recommended extension name -for template
// const handlebars=ExpHandlebars.create({extname:".hbs"});
// app.engine('hbs',handlebars.engine);
// app.set("view engine","hbs");
// //tells Express where template files (views) are stored
// app.set("views", "./views"); 


//Router
//app.get('/reg')  ---register page
// app.get('/',(req,res)=>{
//     res.render("home");
// });
// //home page


 const routes =require("./Server/Routes/student");
 app.use('/api/v1/',routes);

//mysql

// const con =mysql.createPool({
//     connectionLimit:10,   // why this line
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PASS,
//     database:process.env.DB_NAME
// });
// //Check database Connection
// con.getConnection((err,connection)=>
// {
//     if(err) throw err
//     console.log("Connection Success")
// })

//Authentication 
const authRoutes = require("./Server/Routes/auth");
// const { verifyToken } = require("./Server/Middleware/authMiddleware");


app.use("/api/v1/auth", authRoutes);

// ✅ Protect CRUD routes using JWT middleware
const studentRoutes = require("./Server/Routes/student");
// app.use("/api/v1/", verifyToken, studentRoutes);
app.use("/api/v1/", studentRoutes);

//listen port 

app.listen(port,()=>
{
    console.log("Listen Port:" +port);
})


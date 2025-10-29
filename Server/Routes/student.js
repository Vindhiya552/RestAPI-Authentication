//create variable for express
const express = require("express");
const router=express.Router();

const studentcontroller =require("../Controllers/studentcontroller");
const verifyToken = require("../Middleware/authMiddleware"); 
//view all record
router.get('/getuser',verifyToken,studentcontroller.view);

//add new record
// router.get('/createuser',studentcontroller.save);
router.post('/createuser',verifyToken,studentcontroller.save);
 

//Update record
// router.get("/edituser/:id",studentcontroller.edituser);
router.post("/updateuser",verifyToken,studentcontroller.edit);

 
//Delete record
router.post("/deleteuser",verifyToken,studentcontroller.delete);


//  router.get('',(req,res)=>{ 
//      res.render("home");
// });

module.exports=router;
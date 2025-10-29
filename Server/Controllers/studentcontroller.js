
const mysql =require ("mysql");
// app.use(express.json());

const con =mysql.createPool({
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
});
//HomePageView
// exports.view=(req,res)=>{

//     con.getConnection((err,connection)=>
// {
//     if(err) throw err
//     // console.log("Connection Success")
//     connection.query("select * from tbl_node",(err,rows)=>
//     {
//         connection.release();
//         if(err){
//             // console.log("Good");
//             //   res.render("home",{rows});
//              console.log("Error:"+err);
//         }
//          res.status(200).json({
//         success: true,
//         total: rows.length,
//         data: rows
//       });

//     });
// });
   
// }

exports.view = (req, res) => {
  con.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).json({
        success: false,
        message: "Database connection failed"
      });
    }

    connection.query("SELECT * FROM tbl_node", (err, rows) => {
      connection.release(); // Always release the connection

      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching data"
        });
      }

      // ✅ Success response
      res.status(200).json({
        success: true,
        total: rows.length,
        data: rows
      });
    });
  });
};

//Add user page show
// exports.adduser=(req,res)=>{
//  res.render("adduser");
// }
//insert save
// exports.save=(req,res)=>{
//      con.getConnection((err,connection)=>
// {
//     if(err) throw err

//     const{name,age,city}=req.body;

//     // console.log("Connection Success")
//     connection.query("INSERT INTO tbl_node ( name, age,city) VALUES (?,?,?)",[name,age,city],(err,rows)=>
//     {
//         connection.release();
//         if(!err){
//             // console.log("Good");
//               res.render("adduser",{msg:"User details added success"});
//         }
//         else{
//             console.log("Error:"+err);
//         }

//     });
// });
// }


exports.save = async (req, res) => {
  try {
    // ✅ Safely check if request body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing. Please send valid JSON data."
      });
    }

    // ✅ Destructure safely
    const { name, age, city } = req.body;

    if (!name || !age || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, age, and city."
      });
    }

    // ✅ Get a database connection from the pool
    con.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection error:", err);
        return res.status(500).json({
          success: false,
          message: "Database connection failed."
        });
      }

      // ✅ Execute SQL query safely
      connection.query(
        "INSERT INTO tbl_node (name, age, city) VALUES (?, ?, ?)",
        [name, age, city],
        (err, result) => {
          connection.release(); // release DB connection

          if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({
              success: false,
              message: "Error inserting data into database."
            });
          }

          // ✅ Success response
          res.status(201).json({
            success: true,
            message: "User added successfully.",
            insertedId: result.insertId
          });
        }
      );
    });
  } catch (error) {
    // ✅ Catch any runtime errors
    console.error("Unexpected error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


//edit user get



//edit user save and show that page

exports.edit = async (req, res) => {
  try {
    const { id, name, age, city } = req.body;

    // ✅ Validate input
    if (!id || !name || !age || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide id, name, age, and city."
      });
    }

    // ✅ Connect to DB
    con.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection error:", err);
        return res.status(500).json({
          success: false,
          message: "Database connection failed."
        });
      }

      // ✅ Update query
      const sql = "UPDATE tbl_node SET name = ?, age = ?, city = ? WHERE id = ?";
      connection.query(sql, [name, age, city, id], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).json({
            success: false,
            message: "Error updating record."
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found."
          });
        }

        // ✅ Success
        res.status(200).json({
          success: true,
          message: "User updated successfully.",
          updatedId: id
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

//delete data 
exports.delete = async (req, res) => {
  try {
    const { id } = req.body;

    // ✅ Validate
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID to delete."
      });
    }

    // ✅ Connect to DB
    con.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection error:", err);
        return res.status(500).json({
          success: false,
          message: "Database connection failed."
        });
      }

      // ✅ Delete query
      const sql = "DELETE FROM tbl_node WHERE id = ?";
      connection.query(sql, [id], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error deleting record:", err);
          return res.status(500).json({
            success: false,
            message: "Error deleting record."
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found."
          });
        }

        // ✅ Success
        res.status(200).json({
          success: true,
          message: "User deleted successfully.",
          deletedId: id
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

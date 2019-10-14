var mysql = require('mysql');
var express = require('express');
const joi=require("joi");
const async=require("async")
const swaggerUi = require('swagger-ui-express'); 

var app = express();
app.use(express.json())
const swaggerDocument = require('./swagger.json');
app.use('/myname', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'student'
});
connection.connect(function (err, result) {
    if (err) {
        console.log("error occurred");
    }
    console.log("Connected!");
    //console.log(result);

});
app.get("/read/:id",function(req,res) // read api reading table from DB 
{
    async.waterfall([
        function(callback) {
            connection.query("select id from ambesh1 where id=?",[req.params.id], function(err, results) {
                if(err)
                {
                    res.send("error occurred at the time of reading")
                }   
               console.log(results[0].id);
               
            })  
          callback(null, 'task1');
        },
        function(arg1, callback) {
        connection.query("select email from ambesh1 where id=?",[req.params.id], function(err, results) {
           if(err)
           {
               res.send("error occurred at the time of email")
           }
           console.log(results[0].email);
           
        })
          arg2="task1"+",task2"
          callback(null, arg2);
        },
        function(arg1, callback) {
            connection.query("select password from ambesh1 where id=?",[req.params.id], function(err, results) {
                if(err)
                {
                    res.send("error occurred at the time of email")
                }
                console.log(results[0].password);
                
             })
             arg3=arg1+"and task3 completed";
          callback(null, arg3);
        }
      ], function(err, result) {
      
        console.log(result);
      });
})
    app.delete("/delete/:email",function(req,res) // delete api  deleting data in DB
{
    connection.query("select * from ambesh1 " ,function(err, results) {
        if(err)
        {
            res.send("error occurred at the time of reading")
        }
        else{
            res.send("deleted  successful");
            
        }

    })
})

app.post('/ambesh', function(req, res) {  //post api for validation of email and password
    const schema=joi.object().keys({
        email:joi.string().trim().email(),
        password:joi.string().min(5).max(10).required(),

    });
    joi.validate(req.body,schema,(err,result)=>{
        if(err)
        {
          res.send("error occurred")
            console.log(err);
        }
        console.log(result);
        //  res.send({
        //    id:req.body.email,
        //    password:req.body.password
        //  })
        });
	var email = req.body.email;
	var password = req.body.password;
	if (email && password) {
        // console.log(email);
        // console.log(password);
        
		connection.query("select password from ambesh1  where email =?",[email], function(err, results) {
        //   console.log("log num 2",password,results);
        //   console.log("error",error);
        if(err)
        {
            res.send(err)
        }
         else{
            if( results[0].password==password)
            {
                console.log(` your email id is ${results[0].email} and your passowrd ${results[0].password}`);
                
              res.send("successful login")
            }

            else {
				res.send('Incorrect Username and/or Password!');
			}			
            // res.end();
        }
		});
	} else {
		res.send('Please enter Username and Password!');
		// res.end();
	}
});
app.put("/update/:id",(req,res)=>   // api for update  password
{
    connection.query("UPDATE ambesh1 SET password ='ambesh@123'  WHERE id=?",[req.params.id],function(err,results){

       if(err)
       {
           console.log("error occurred");
           
       }
       else{
           res.send("password successful update")
       }

    })
})
app.get('/asyncAwait/:id',(req,res)=>{  // through get api and async await function reading data
    function resolveAfter2Seconds() {
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                console.log("hello");
                connection.query("select * from ambesh1 WHERE id=?",[req.params.id],function(err,results){
                  resolve (results)
                });
              }, 2000);
              
        })
    }   
    async function asyncCall() {
      console.log('calling');
      var result = await resolveAfter2Seconds();
      console.log("called");
      console.log(result);
      res.send(result);
    }
    
    asyncCall();
    
})

app.listen(3007);
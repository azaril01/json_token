const express = require('express'); 
const jwt = require('jsonwebtoken'); 
 
const app = express() 
const port = 3000 
//Database of users 
let dbUsers = [ 
  { 
    username: "azaril", 
    password: "2222", 
    name: "azarilll", 
    email: "azaril@lol.com" 
  }, 
  { 
    username: "zaid", 
    password: "zaidhan", 
    name: "zaihan01", 
    email: "zaid@lol.com" 
  }, 
  { 
    username: "adha", 
    password: "123456", 
    name: "adha_ridzwan", 
    email: "wan@lol.com" 
  } 
] 
 
app.use(express.json()); 
 
app.get('/hello', verifyToken, (req, res) => { 
  console.log(req.user) 
   
  res.send('Hello World!') 
}) 
 
app.post('/login', (req, res) => { 
  let data = req.body 
  // res.send(' Post request '+ JSON.stringify(data)); 
  //res.send(' Post request '+ data.name +data.password) 
  let user = login(data.username, data.password); 
 
  res.send(generateToken(user)) 
}); 
 
app.post('/register', (req, res) => { 
  let data = req.body 
  res.send( 
    register( 
      data.username, 
      data.password, 
      data.name, 
      data.email 
    ) 
  ) 
}) 
 
function login(loginuser, loginpassword) { 
  console.log("someone logging your account", loginuser, loginpassword) //Display message to ensure function is called 
  //Verify username is in the database 
  const user = dbUsers.find(user => user.username == loginuser && user.password == loginpassword); 
  if (user) { 
    return (user); 
  } else { 
    return ({ error: "User not found" }); 
  } 
} 
 
function register(newusername, newpassword, newname, newemail) { 
  //verify if username is already in databse 
  let match = dbUsers.find(element => 
    element.username == newusername 
  ) 
  if (match) { 
    return ("username already exist, choose another") 
  } else { 
    // add info into database 
    dbUsers.push({ 
      username: newusername, 
      password: newpassword, 
      name: newname, 
      email: newemail 
    }) 
    return ("registered") 
  } 
} 
 
// To generate JWT Token 
function generateToken(userProfile) { 
  return jwt.sign( 
    userProfile, 
    'my_super_secret_password_that_hack_taktau', 
    { expiresIn: 60 * 60 }); 
} 
 
// To verify JWT Token 
function verifyToken(req, res, next) { 
  let header = req.headers.authorization 
  console.log(header) 
 
  let token = header.split(' ')[1] 
 
  jwt.verify(token, 'my_super_secret_password_that_hack_taktau', function(err, decoded) { 
    if(err) { 
      res.send("Invalid Token") 
    } 
     
    req.user = decoded 
    next() 
  }); 
} 
 
app.listen(port, () => { 
  console.log(`Example app listening on port ${port}`) 
})
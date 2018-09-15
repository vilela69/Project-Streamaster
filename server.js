const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs')


const port = process.env.PORT || 5000;
const print = console.log

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "localhost",
  user: "fredcurti",
  password: "1170",
  database: 'streamaster'
});

con.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected"); 
});

app.get('/oi', (req, res) => {
  res.send('sup')
})
// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  con.query("SELECT * FROM User WHERE email=? AND password=?", [email, password], (err, result) => {
    if (err) throw err;
    if (result < 1) {
      res.json({ status: 404 })        
    } else {
      res.json({...result[0], status: 200})
    }
  })
})

// REGISTER
app.post('/api/user', (req, res) => {
  console.log(req.body)
  const { email, username, password, file } = req.body
  print(email, username, password, null)
  con.query("SELECT * FROM User WHERE email=? OR username=?", [email, username], (err, result) => {
    if (err) throw err;
    if (result == 1) {
      res.json({ status: 404 })
    } else {
      con.query("INSERT INTO User (email, username, password, thumbnail_url) VALUES (?,?,?,?)", [email, username, password, null], (err, result) => {
        res.json({ email: email, username: username, password: password, status: 200 })
      })
    }
  })
})


// con.query('INSERT INTO User (name, password, email, image) values(?,?,?,?)', [], (err, result) => {
//   res.send({ express: 'Hello From Express' });
// })

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.listen(port, () => console.log(`Listening on port ${port}`));
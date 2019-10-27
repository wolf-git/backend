const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

con.connect(err => {
  if (err) throw err;
})

let token, curUser;

const login = (req, res, next) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM customers';
  con.query(sql, (err, users, _) => {
    if (err) throw err;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      curUser = Object.assign({}, user);
      token = jwt.sign({ sub: user.username }, config.secret);
      res.send({
        users: users.map(u => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        }),
        token
      });
    } else {
      res.status(400).send({ message: 'Username or password is incorrect' });
    }
  });
}

const signup = (req, res, next) => {
  const { username, email, password } = req.body;
  const sql = `INSERT INTO customers (username, email, password) 
  VALUES ('${username}', '${email}', '${password}')`;
  console.log(sql);
  con.query(sql, (err) => {
    if (err) throw err;
    token = jwt.sign({ sub: username }, config.secret);
    sql = 'SELECT * FROM customers';
    con.query(sql, (err, users, _) => {
      if (err) throw err;
      curUser = { username, email, password };
      token = jwt.sign({ sub: username }, config.secret);
      res.status(200).send({
        users: users.map(u => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        }),
        token,
        message: 'OK',
      });
    });
  });
}

const getMydata = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    jwt.verify(authorization.split(' ')[1], config.secret, (err) => {
      if (err) {
        console.log('jwt incorrect');
        throw err;
      } else {
        console.log('jwt correct');
        res.send({curUser});
      }
    });
  } else {
    console.log('no authorization');
  }
}

module.exports = { login, signup, getMydata };
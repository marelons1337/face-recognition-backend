const express = require('express');
const cors = require('cors');
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const users = require('./controllers/users')
const image = require('./controllers/image')
const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'rafal',
      password : '',
      database : 'face-recognition'
    }
  });

const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());
app.use(cors());


app.post('/signin', (req, res) => { signin.signInHandler(req, res, bcrypt, db) })

app.put('/image', (req, res) => { image.imageHandler(req, res, db) })

app.post('/imageurl', (req, res) => { image.apiHandler(req, res) })

//currently not used in the front-end
app.get('/users/:id', (req, res) => { users.usersHandlerGet(req,res,db) })

app.post('/register', (req, res) => { register.registerHandler(req, res, db, bcrypt, saltRounds) })

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`running on port ${ process.env.PORT }`);
});

const express = require('express');
const cors = require('cors');

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


app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        bcrypt.compare(req.body.password, data[0].hash, function(err, result) {
            if (result) {
                return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        });
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id )
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    }) 
    .catch(err => res.status(400).json("unable to get entries3"))
})

//currently not used in the front-end
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json("not found")
        }
    })
    .catch(err => res.status(400).json("error"))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        db.transaction( trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
                    
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
    })
})

app.listen(3000, ()=> {
    console.log('running on port 3000');
});

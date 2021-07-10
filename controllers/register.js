const registerHandler = (req, res, db, bcrypt, saltRounds) => {

    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrent form submission')
    }
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
        .catch(err => {console.log(err); res.status(400).json('unable to register')})
    })
}

module.exports = {
    registerHandler: registerHandler
}
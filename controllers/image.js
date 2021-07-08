const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '503f6a53e1e34c548ab59411cc49bf2e'
   })  

const apiHandler = (req, res) => {
    app.models
        .predict('a403429f2ddf4b49b307e318f00e528b', req.body.input)
        .then(data => {
        res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'))
}


const imageHandler = (req, res, db) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id )
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    }) 
    .catch(err => res.status(400).json("unable to get entries3"))
}

module.exports = {
    imageHandler:imageHandler,
    apiHandler:apiHandler
}
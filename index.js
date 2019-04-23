// implement your API here
//import express and cors
const express = require('express');
const cors = require('cors');

//define server and database
server = express();
db = require('./data/db')

//allow for json to be used for writing 
server.use(express.json());
server.use(cors());

//make a constant reply for 404 & 500
const sendUserError = (res) => {
  res.status(500);
  res.json({ errorMessage: "Item can't be Located" })
};

const sendUserMissError = (res) => {
  res.status(404);
  res.json({ errorMessage: 'User not found' });
  return;
}

//update the server info 
server.post('/api/users', (req, res) => {
  //add the request body
  const { name, bio} = req.body;
  const newCharacter = { name, bio };
  //check the req.body
  if ( !name || !bio ) {
    return res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
  }
  db
  .insert(newCharacter)
  .then( info => {
    res.status(201).json(info);
  })
  .catch( err => {
    res.status(500).json({ error: err, message: 'There was an error while saving the user to the database' });
  })
})

server.get('/api/users', (req, res) => {
  db
  .find()
  .then( info => {
    res.status(200).json(info)
  })
  .catch( err => {
    return sendUserError(err);
  })
})

server.get('/api/users/:id', (req, res) => {
  //specify the id
  const ID = req.params.id
  db
  .findById(ID)
  .then( info => {
    //check the id
    if (info == undefined) {
      return sendUserMissError(res)
    }
    else{
      res.status(200).json(info)
    }
  })
  .catch( err => {
    return sendUserError(err);
  })
})

server.delete('/api/users/:id', (req, res) => {
  //specify the id
  const ID = req.params.id
  db
  .remove(ID)
  .then( info => {
    //check the id
    if (info == undefined) {
      return sendUserMissError(res)
    }
    else{
      res.status(200).json(info);
    }
  })
  .catch( err => {
    res.status(500).json({ error: err, message:'could not delete the requested item' });
  })
})

server.put('/api/users/:id', (req, res) => {
  //specify the id and req.body
  const ID = req.params.id
  const { name, bio} = req.body;
  const newCharacter = { name, bio };
  //check the req.body
  if ( !name || !bio ) {
    return res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
  }
  db
  .update(ID, newCharacter)
  .then( info => {
    //check the id
    if (info == undefined) {
      return sendUserMissError(res)
    }
    else{
      res.status(200).json(info)
    }
  })
  .catch( err => {
    res.status(500).json({ error: err, message:'could not put to server' });
  })
})

//server listen
server.listen(5000, () => {
  console.log('\n up and running \n');
})
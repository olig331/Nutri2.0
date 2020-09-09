const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User');
require('dotenv').config();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json({
  type: ['application/json', 'text/plain']
}))




//IMPORT ROUTES
const postsRoute = require('./routes/posts');
const creatingUserRoute = require('./routes/createUser');
const router = require('./routes/createUser');

app.use('/posts', postsRoute);

app.use('/createUser', creatingUserRoute);

app.get('/', (req, res) => {
  res.send("Home")
})

app.get('/login', async (req, res) => {
  User.findOne({ userName: req.query.name })
    .then(users => {
      console.log(users)
      res.status(200).json(users)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});


app.patch('/updateUserFood', async (req, res)=>{
  try{
    const updatedFood = await User.updateOne(
      {id: req.query.userId},
      {$set: {usersDailyFood: req.body}}
    );
    res.json(updatedFood);
  }catch (err) {
    res.json({message: err})
  }
})

//CONNTECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to nutri DB ")
  }
);

app.listen(5000);

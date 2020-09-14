const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User');
const router = require('./routes/createUser');
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

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())


//IMPORT ROUTES
const creatingUserRoute = require('./routes/createUser');

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

app.get('/getDailyFood', async (req,res)=>{
  User.findOne({_id: req.query.userId})
  .then(found =>{
    console.log(found)
    res.status(200).json(found.usersDailyFood)
  })
  .catch(err =>{
    res.status(500).json({
      message: err
    })
  })
})

app.post('/updateUsersFood', async  (req, res)=>{
  console.log("updating users Food")
  console.log(req.body)
  console.log(req.query.userId)
  User.updateOne(
    {_id: req.query.userId},
    {$set: {usersDailyFood: req.body}}
  )
  .then(user =>{
    res.status(200).json(user.usersDailyFood)
  })
  .catch(err =>{
    res.status(500).json({
      message: err
    });
    console.log(err);
  })
})

app.post('/resetFood', async (req, res)=>{
    User.updateOne(
      {_id: req.query.userId},
      {$set: {usersDailyFood: req.body}}
    )
    .then(user =>{
      console.log(user.usersDailyFood)
      res.status(200).json(user.usersDailyFood)
    })
    .catch(err =>{
      res.status(500).json({
        message: err
      })
    })
})

app.post('/updateUserHistory', async (req, res)=>{
  console.log(req.query.userId);
  console.log(req.body)
  User.updateOne(
      {_id: req.query.userId},
      {$addToSet: {usersHistory: [...req.body]}},
  )
    .then(user =>{
      console.log(user)
      res.json("user updated")
    })
    .catch(err =>{
    res.json({
      message: err
    })
  })
})

app.get('/history', async (req, res)=>{
  User.findOne({_id: req.query.userId})
  .then(history =>{
    console.log(history.usersHistory)
    res.status(200).json(history.usersHistory)
  })
  .catch(err =>{
    res.status(500).json({
      message: err
    })
  });
});

app.get('/refetchUserData', async (req, res)=>{
  User.findOne({_id: req.query.userId})
  .then(user =>{
    res.status(200).json(user)
  })
  .catch((err) =>{
    res.status(500).json({
      message: err
    });
  });
});

app.post('/updateUsersSettings', async (req, res)=>{
  User.updateOne(
    {_id: req.query.userId},
    {$set: {usersPersonalSettings: req.body}}
  )
  .then(res =>{
    res.status(200).json(res)
  })
  .catch(err =>{
    res.status(500).json({
      message: err
    });
  });
});

//CONNTECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to nutri DB ")
  }
);

app.listen(5000);

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(express.json({
  type: ['application/json', 'text/plain']
}))


//IMPORT ROUTES
const postsRoute = require('./routes/posts');
const creatingUserRoute = require('./routes/createUser')

app.use('/posts', postsRoute);

app.use('/createUser', creatingUserRoute);

app.get('/', (req, res)=>{
  res.send("Home")
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

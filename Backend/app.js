const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { deleteOne } = require('./models/User');
const app = express();
const User = require('./models/User');
const router = require('./routes/createUser');
const nodemailer = require('nodemailer')
const crypto = require('crypto')
require('dotenv').config();
const bcrypt = require('bcrypt')

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json({
  type: ['application/json', 'text/plain']
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


//IMPORT ROUTES
const creatingUserRoute = require('./routes/createUser');

app.use('/createUser', creatingUserRoute);

app.get('/', (req, res) => {
  res.send("Home")
})




app.post('/login', function (req, res) {
  var username = req.body.userName;
  var password = req.body.passWord;
  console.log(username)
  console.log(password)

  const user = User.findOne({ userName: username }, function (err, user) {
    if (err) {
      console.log(err)
      return res.json("401")
    }
    if (!user) {
      return res.json("401")
    }
    console.log(user)
    user.comparePassword(password, function (err, isMatch) {
      if (isMatch) {
        return res.json(user);
      } else {
        return res.json("401")
      }
    });
  });
});



// console.log(req.query.password)
// const user = User.findOne({ userName: req.query.q.name, userPassword: passMatch(req.query.q.pass) })
//   .then(users => {
//     console.log(users)
//     res.status(200).json(users)
//   })
//   .catch(err => {
//     console.log(err);
//     res.status(500).json({
//       error: err
//     })
//   })

app.get('/fetchCustomAdds', (req, res) => {
  console.log(req.query.userId);
  User.findOne({ _id: req.query.userId })
    .then(user => {
      res.status(200).json(user.usersCustomFood)
    })
    .catch((err) => {
      res.json({
        status: 400,
        err: err,
        message: "Error occoured"
      })
    })
});

app.get('/validateUserName', (req, res) => {
  console.log(req.query.name)
  console.log("validating user name")
  User.findOne({ userName: req.query.name })
    .then(users => {
      if (users) {
        res.json({
          status: 401,
          message: "username taken"
        })
      } else {
        res.json({
          status: 200,
          message: "user name available"
        })
      }
    })
    .catch(err => {
      res.json({
        status: 404,
        message: err
      })
    })
})

app.get('/getDailyFood', async (req, res) => {
  User.findOne({ _id: req.query.userId })
    .then(found => {
      console.log(found)
      res.status(200).json(found.usersDailyFood)
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
})

app.post('/updateUsersFood', async (req, res) => {
  console.log("updating users Food")
  console.log(req.body)
  console.log(req.query.userId)
  User.updateOne(
    { _id: req.query.userId },
    { $set: { usersDailyFood: req.body } }
  )
    .then(user => {
      res.status(200).json(user.usersDailyFood)
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
      console.log(err);
    })
})

app.post('/resetFood', async (req, res) => {
  User.updateOne(
    { _id: req.query.userId },
    { $set: { usersDailyFood: req.body } }
  )
    .then(user => {
      console.log(user.usersDailyFood)
      res.status(200).json(user.usersDailyFood)
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
})

app.post('/updateUserHistory', async (req, res) => {
  console.log(req.query.userId);
  console.log(req.body)
  User.updateOne(
    { _id: req.query.userId },
    { $addToSet: { usersHistory: [...req.body] } },
  )
    .then(user => {
      console.log(user)
      res.json("user updated")
    })
    .catch(err => {
      res.json({
        message: err
      })
    })
})

app.get('/history', async (req, res) => {
  User.findOne({ _id: req.query.userId })
    .then(history => {
      console.log(history.usersHistory)
      res.status(200).json(history.usersHistory)
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    });
});

app.get('/refetchUserData', async (req, res) => {
  User.findOne({ _id: req.query.userId })
    .then(user => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(500).json({
        message: err
      });
    });
});

app.post('/updateUsersSettings', async function (req, res) {
  console.log(req.query.userId);
  console.log(req.body);
  User.updateOne(
    { _id: req.query.userId },
    { $set: { usersPersonalSettings: { ...req.body } } }
  )
    .then(response => {
      res.json({
        status: 200,
        message: "settings updates"
      });
    })
    .catch(err => {
      console.log(err)
      res.json({
        status: 500,
        message: "updateFailed"
      });
    });
});

console.log(process.env.EMAIL)
console.log(process.env.PASSWORD)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});



app.post('/forgotUserName', async function (req, res) {
  const emailAddress = req.body.email
  const user = await User.findOne({ email: req.body.email })
  if (user !== null) {
    var mailOptions = {
      from: process.env.EMAIL,
      to: emailAddress,
      subject: "Forgotten User Name | Nutri",
      text: `Your Nutri User name is: ${user.userName}`
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err)
        res.json({
          status: 401,
          message: "Email failed to send error on our Side"
        })
      } else {
        console.log("email sent:" + info.response);
        res.json({
          status: 200,
          message: `User Found email sent to ${req.body.email}`
        })
      }
    })
  } else {
    res.json({
      status: 404,
      message: "No User found with entered Email"
    })
  }
});


app.post('/forgotPassword', async function (req, res) {
  const name = req.body.name;
  const mail = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
    }
    console.log(buffer)
    const token = buffer.toString("hex")
    console.log(token)

    User.findOne({ userName: name, email: mail })
      .then(user => {
        if (!user) {
          return res.json({
            status: 404,
            message: "No user found with entered details"
          })
        }
        user.resetToken = token
        user.expireToken = Date.now() + 1800000
        user.save().then((result) => {
          transporter.sendMail({
            from: process.env.EMAIL,
            to: mail,
            subject: "Password Reset | Nutri",
            html: `
              <p>Your requested password reset</p>
              <h5>Click on this <a href="http://localhost:3000/${token}">link<a/> to reset password</h5>
            `
          })
          res.json({
            status: 200,
            message: "Password Reset email Sent please check your inbox"
          })
        })
      })
  })
})

app.post('/newUserPassword', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token
  const user = User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
  if (user !== null) {
    bcrypt.hash(newPassword, 10)
      .then(hashedPassword => {
        User.updateOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } },
          { $set: { password: hashedPassword, resetToken: undefined, expireToken: undefined } }
        )
          .then((saveduser) => {
            res.json({
              status: 200,
              message: "password Updated Success"
            })
          })
      })
  } else {
    res.json({
      status: 422,
      message: "password Reset Failed please try again "
    })
  }
})

app.post('/addToCustomList', (req, res) => {
  console.log(req.body.id);
  console.log(req.body.payload);
  User.updateOne(
    { _id: req.body.id },
    { $addToSet: { usersCustomFood: req.body.payload } },
  )
    .then(response => {
      res.json({
        status: 200,
        message: "Item Added to custom foods Array"
      });
    })
    .catch(err => {
      console.log(err)
      res.json({
        status: 500,
        message: "updateFailed"
      });
    });
})

// app.post('reset-password', (req, res)=>{
//   crypto.randomBytes(32, (err, buffer)=>{
//     if(err){
//       console.log(err)
//     }
//     console.log(buffer)
//     const token = buffer.toString("hex")
//     console.log(token)
//   })
// })

//CONNTECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to nutri DB ")
  }
);

app.listen(5000);

const mongoose = require('mongoose');
//import Schema from 'mongoose'
const bcrypt = require('bcrypt');



const UserSchema = mongoose.Schema({
  userName: {
    type: String,
    requiured: true
  },
  userPicture: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  email: {
    type: String,
    required: true,
  },
  usersPersonalSettings: {
    gender: {
      type: String,
      requiured: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    weightUnit: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      requiured: true,
    },
    heightUnit: {
      type: String,
      requiured: true,
    },
    goal: {
      type: String,
      required: true,
    },
    activityLevel: {
      type: String,
      required: true,
    },
  },
  usersDailyFood: {
    type: Array,
    required: false
  },
  usersHistory: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  usersCustomFood: {
    type: Array,
    required: false,
  }
})

UserSchema.pre('save', async function (next) {
  const user = this
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)
    user.password = hashedPassword;
    next()
  } catch (error) {
    next(error)
  }
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }

    return cb(null, isMatch);
  })
}



module.exports = mongoose.model('User', UserSchema);
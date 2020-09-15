const mongoose = require('mongoose');
//import Schema from 'mongoose'

const UserSchema = mongoose.Schema({
  userName: {
    type: String,
    requiured: true
  },
  userPicture: {
    type: String,
    required: false
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
  }
})

module.exports = mongoose.model('User', UserSchema);
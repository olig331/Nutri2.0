const express = require ('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res)=>{
  console.log(req.body);
  const user = new User({
    userName: req.body.userName,
    userPicture: req.body.userPicture,
    usersPersonalSettings :{
      gender: req.body.usersPersonalSettings.gender,
      age: req.body.usersPersonalSettings.age,
      weight: req.body.usersPersonalSettings.weight,
      weightUnit: req.body.usersPersonalSettings.weightUnit,
      height: req.body.usersPersonalSettings.height,
      heightUnit: req.body.usersPersonalSettings.heightUnit,
      goal: req.body.usersPersonalSettings.goal,
      activityLevel: req.body.usersPersonalSettings.activityLevel
    },
    usersDailyFood: req.body.usersDailyFood,
    usersHistory: req.body.usersHistory
  });
  try{
    const savedData = await user.save()
      res.send(json(savedData))
  }catch(err){
    res.json({message: err});
  }
})

module.exports = router;
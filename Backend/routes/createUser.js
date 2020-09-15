const express = require ('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res)=>{
  console.log(req.body);
  const user = new User(req.body);
  try{
    const savedData = await user.save()
      res.send(json(savedData))
  }catch(err){
    res.json({message: err});
  }
})

module.exports = router;
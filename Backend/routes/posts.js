const express = require ('express');
const router = express.Router();
const Post = require('../models/Posts');

router.get('/', (req, res) =>{
    res.send("we are in posts ");
});

router.get('/test', (req, res)=>{
  res.send("testing post ")
});

router.post('/', async (req, res)=>{
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });
  try{
    const savedData = await post.save()
      res.json(savedData)
  }catch(err){
    res.json({message: err});
  }
});;

module.exports = router;

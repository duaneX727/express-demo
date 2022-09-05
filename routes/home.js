const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  //res.render('Hola Mondo!!!');
  res.render('index',{title:'My Express App', message:'Hola Mondo!'});
});
module.exports = router;
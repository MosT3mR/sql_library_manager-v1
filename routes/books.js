var express = require('express');
var router = express.Router();
const Book = require('../models').Book

/* asyncHandler */
function asyncHandler(cd){
  return async(req,res,next) => {
    try {
      await cd(req,res,next)
    } catch(error) {
      next(error)
    }
  }
}

/* GET Books listing. */
router.get('/', asyncHandler(async(req,res)=>{
  const books = await Book.findAll();
  res.render('index', {books})
}));

module.exports = router;

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
}))

/* GET New book */
router.get('/new', (req,res) => {
  res.render('new-book', {books: {}, errors: false})
})

/* POST New book */
router.post('/new', asyncHandler(async(req,res)=> {
  let book;
  try {
    const newBook = await Book.create(req.body)
    res.redirect(`/books/${newBook.id}`)
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body)
      res.render('new-book', {book, errors: error.errors})
    } else {
      throw error
    }
  }
}))

/* GET Single book "Update" */
router.get('/:id', asyncHandler(async(req,res,next)=>{
  const book = await Book.findByPk(req.params.id)
  if(book){
    res.render('update-book', {book, errors: false}) // adding SequelizeValidationError 
  } else {
    res.status(404)
    next(); // added method to handle non-existent book id
  }
}))

/* POST Single book "Update" */
router.post('/:id', asyncHandler(async(req,res)=>{
  try {
    const book = await Book.findByPk(req.params.id)
    await book.update(req.body)
    res.redirect('/books')
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // added the validator to the update
      const book = await Book.findByPk(req.params.id)
      res.render('update-book', {book, errors: error.errors})
  } else {
    throw console.error();
  }
}
}))

/* POST DELETE Single book */
router.post('/:id/delete', asyncHandler(async(req,res)=>{
  const book = await Book.findByPk(req.params.id)
  await book.destroy()
  res.redirect('/books')
}))


module.exports = router;

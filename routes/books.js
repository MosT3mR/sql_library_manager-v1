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
  res.render('new-book')
})

/* POST New book */
router.post('/new', asyncHandler(async(req,res)=> {
  const newBook = await Book.create(req.body)
  res.redirect(`/books/${newBook.id}`)
}))

/* GET Single book "Update" */
router.get('/:id', asyncHandler(async(req,res)=>{
  const book = await Book.findByPk(req.params.id)
  res.render('update-book', {book})
}))

/* POST Single book "Update" */
router.post('/:id', asyncHandler(async(req,res)=>{
  const book = await Book.findByPk(req.params.id)
  await book.update(req.body)
  res.redirect('/books')
}))

/* POST DELETE Single book */
router.post('/:id/delete', asyncHandler(async(req,res)=>{
  const book = await Book.findByPk(req.params.id)
  await book.destroy()
  res.redirect('/books')
}))


module.exports = router;

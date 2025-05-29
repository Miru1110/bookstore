import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, publishYear, price } = req.body;

    if (!title || !author || !publishYear || price == null) {
      return res.status(400).json({
        msg: "Send all required fields: title, author, publishYear, price",
      });
    }

    const newBook = { title, author, publishYear, price };
    const book = await Book.create(newBook);

    console.log('Book created:', book);

    return res.status(201).send(book);
  } catch (error) {
    console.log('Create book error:', error.message);
    res.status(500).json({ msg: error.message });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    console.log(`Fetched ${books.length} books`);
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log('Get all books error:', error.message);
    res.status(500).json({ msg: error.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      console.log(`Book with id ${id} not found`);
      return res.status(404).json({ msg: 'Book not found' });
    }

    console.log('Fetched book by id:', book);

    return res.status(200).json({ data: book });
  } catch (error) {
    console.log('Get book by ID error:', error.message);
    res.status(500).send({ msg: error.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const { title, author, publishYear, price } = req.body;

    if (!title || !author || !publishYear || price == null) {
      return res.status(400).json({
        msg: "Send all required fields: title, author, publishYear, price",
      });
    }

    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body, { new: true }); // return updated doc

    if (!result) {
      console.log(`Book with id ${id} not found for update`);
      return res.status(404).json({ msg: "Book not found" });
    }

    console.log('Book updated:', result);

    // Return updated book data instead of just msg
    return res.status(200).json({ msg: "Book Updated successfully", data: result });
  } catch (error) {
    console.log('Update book error:', error.message);
    res.status(500).send({ msg: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      console.log(`Book with id ${id} not found for delete`);
      return res.status(404).json({ msg: "Book not found" });
    }

    console.log('Book deleted:', result);

    return res.status(200).json({ msg: "Book Deleted successfully" });
  } catch (error) {
    console.log('Delete book error:', error.message);
    res.status(500).send({ msg: error.message });
  }
});

export default router;

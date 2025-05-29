// routes/cart.js
import express from 'express';
import User from '../models/User.js';
import Book from '../models/bookModel.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

// ✅ Middleware to verify JWT and get user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// ✅ Get Cart Items
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.book');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// ✅ Add book to Cart — fixed middleware name
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID is required' });

    const user = await User.findById(req.userId);

    const existingCartItem = user.cart.find(item => item.book.toString() === bookId);

    if (existingCartItem) {
      existingCartItem.quantity += quantity || 1;
    } else {
      user.cart.push({ book: bookId, quantity: quantity || 1 });
    }

    await user.save();
    res.json({ message: 'Book added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book to cart' });
  }
});

// ✅ Remove book from Cart
router.post('/remove', verifyToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID is required' });

    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(item => item.book.toString() !== bookId);

    await user.save();
    res.json({ message: 'Book removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove book from cart' });
  }
});

export default router;

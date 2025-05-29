import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddShoppingCart, MdOutlineDelete } from 'react-icons/md';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://book-store-b8k4.onrender.com/books');
        console.log('Books fetched:', response.data.data);
        setBooks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-center items-center gap-x-4 mb-6">
        <button
          className={`px-4 py-1 rounded-lg ${
            showType === 'table' ? 'bg-sky-600 text-white' : 'bg-sky-300 hover:bg-sky-600'
          }`}
          onClick={() => setShowType('table')}
        >
          Table
        </button>
        <button
          className={`px-4 py-1 rounded-lg ${
            showType === 'card' ? 'bg-sky-600 text-white' : 'bg-sky-300 hover:bg-sky-600'
          }`}
          onClick={() => setShowType('card')}
        >
          Card
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Books List</h1>
        <div className="flex gap-4">
          <Link
            to="/books/create"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Book
          </Link>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : showType === 'table' ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">Published Year</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="text-center">
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">{book.publishYear}</td>
                <td className="border px-4 py-2 flex justify-center space-x-2">
                  <Link to={`/books/details/${book._id}`} title="View">
                    <BsInfoCircle className="text-blue-600 text-2xl hover:text-blue-800" />
                  </Link>
                  <Link to={`/books/edit/${book._id}`} title="Edit">
                    <AiOutlineEdit className="text-green-600 text-2xl hover:text-green-800" />
                  </Link>
                  <Link to={`/books/delete/${book._id}`} title="Delete">
                    <MdOutlineDelete className="text-red-600 text-2xl hover:text-red-800" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold">{book.title}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Published Year:</strong> {book.publishYear}</p>
              <div className="flex space-x-3 mt-4">
                <Link to={`/books/details/${book._id}`} title="View">
                  <BsInfoCircle className="text-blue-600 text-2xl hover:text-blue-800" />
                </Link>
                <Link to={`/books/edit/${book._id}`} title="Edit">
                  <AiOutlineEdit className="text-green-600 text-2xl hover:text-green-800" />
                </Link>
                <Link to={`/books/delete/${book._id}`} title="Delete">
                  <MdOutlineDelete className="text-red-600 text-2xl hover:text-red-800" />
                </Link>
                <button
                  onClick={() => handleAddToCart(book._id)}
                  title="Add to Cart"
                  className="text-yellow-600 text-2xl hover:text-yellow-800"
                >
                  <MdOutlineAddShoppingCart />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

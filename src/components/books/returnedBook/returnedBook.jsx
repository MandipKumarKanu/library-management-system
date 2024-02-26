import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../helper/firebaseConfig';
import './returnedBook.css';

function ReturnedBook() {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const returnedBooksCollection = collection(db, 'returned_books');
        const querySnapshot = await getDocs(returnedBooksCollection);

        const result = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const returnedBook = {
            id: doc.id,
            data: data,
          };
          result.push(returnedBook);
        });

        console.log("result", result)
        setReturnedBooks(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching returned books:', error);
        setError('Error fetching returned books. Please try again later.');
        setLoading(false);
      }
    };

    fetchReturnedBooks();
  }, []);

  return (
    <div className="returned-book-container">
      <h2 className="returned-book-title">Returned Books</h2>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : returnedBooks && returnedBooks.length > 0 ? (
        <table className="returned-book-table">
          <thead>
            <tr className="returned-book-table-row">
              <th className="returned-book-table-header">Book Name</th>
              <th className="returned-book-table-header">Author</th>
              {/* ... other headers ... */}
              <th className="returned-book-table-header">Return Date</th>
            </tr>
          </thead>
          <tbody>
            {returnedBooks.map((returnedBook) => (
              <tr key={returnedBook.id} className="returned-book-table-row">
                <td className="returned-book-table-data">{returnedBook.data.book.data.bookName}</td>
                <td className="returned-book-table-data">{returnedBook.data.book.data.author}</td>
                {/* ... other data ... */}
                <td className="returned-book-table-data">
                  {returnedBook.data.returnDate &&
                    returnedBook.data.returnDate.toDate().toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : ( 
        <p className="no-returned-books-message">No books have been returned</p>
      )}
    </div>
  );
}


export default ReturnedBook;
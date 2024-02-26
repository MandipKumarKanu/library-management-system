import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../helper/firebaseConfig';

function AllIssued() {
  const [totalIssuedBooks, setTotalIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalIssuedBooks = async () => {
      try {
        const totalIssuedBooksCollection = collection(db, 'total_issued_books');
        const querySnapshot = await getDocs(totalIssuedBooksCollection);

        const totalIssuedBooksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        console.log(totalIssuedBooksData);

        setTotalIssuedBooks(totalIssuedBooksData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching total issued books:', error);
        setError('Error fetching total issued books. Please try again later.');
        setLoading(false);
      }
    };

    fetchTotalIssuedBooks();
  }, []);

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>User Name</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Issue Date</th>
          </tr>
        </thead>
        <tbody>
          {totalIssuedBooks.map((issuedBook) => (
            <>
            <tr key={issuedBook.id}>
              {/* <td>{issuedBook.id}</td> */}
               <td>{issuedBook.data.userData.name}</td>
              <td>{issuedBook.data.data.bookName}</td>
              <td>{issuedBook.data.data.author}</td>
              <td>{issuedBook.data.data.genre}</td>
              <td>{issuedBook.data.issueDate ? new Date(issuedBook.data.issueDate.seconds * 1000).toLocaleString() : 'N/A'}</td> 
            </tr>
            {console.log(issuedBook)}
            </>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>All Issued Books Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : totalIssuedBooks && totalIssuedBooks.length > 0 ? (
        renderTable()
      ) : (
        <p>No total issued books available</p>
      )}
    </div>
  );
}

export default AllIssued;

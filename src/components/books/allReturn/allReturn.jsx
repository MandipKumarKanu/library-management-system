import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../helper/firebaseConfig';

function AllReturn() {
  const [totalReturns, setTotalReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalReturns = async () => {
      try {
        const totalReturnCollection = collection(db, 'totalReturn');
        const querySnapshot = await getDocs(totalReturnCollection);

        const totalReturnsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        setTotalReturns(totalReturnsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching total returns:', error);
        setError('Error fetching total returns. Please try again later.');
        setLoading(false);
      }
    };

    fetchTotalReturns();
  }, []);

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Return Status</th>
            <th>Return Date</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {totalReturns.map((totalReturn) => (
            <tr key={totalReturn.id}>
              <td>{totalReturn.id}</td>
              <td>{totalReturn.data.returnStatus ? 'Returned' : 'Not Returned'}</td>
              <td>{totalReturn.data.returnDate ? new Date(totalReturn.data.returnDate.seconds * 1000).toLocaleString() : 'N/A'}</td>
              <td>{totalReturn.data.returnBookData.book.bookName}</td>
              <td>{totalReturn.data.returnBookData.book.author}</td>
              <td>{totalReturn.data.returnBookData.book.genre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>All Return Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : totalReturns && totalReturns.length > 0 ? (
        renderTable()
      ) : (
        <p>No total returns available</p>
      )}
    </div>
  );
}

export default AllReturn;

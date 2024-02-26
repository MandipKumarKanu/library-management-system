import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../helper/firebaseConfig';

function UserInfoBookIssued() {
  const userId = localStorage.getItem('uid') || null;
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssuedBooks = async () => {
    try {
      if (!userId) {
        // Handle the case where userId is null
        setLoading(false);
        return;
      }

      const booksQuery = query(collection(db, 'myBook'));
      const querySnapshot = await getDocs(booksQuery);

      const result = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document data:', data);
        console.log('Current userId:', userId);

       
          // Additional filtering or manipulation on the userBooks array
          const filteredBooks = userBooks.filter(book => book.id === userId);

          if (filteredBooks.length > 0) {
            result.push({
              id: doc.id,
              data: {
                issuedBooks: filteredBooks,
              },
            });
          }
        // }
      });

      // Additional filtering or manipulation on the entire result array
      const finalResult = result.filter(book => book.id === userId);

      console.log('Fetched data:', finalResult);

      setIssuedBooks(finalResult);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching issued books:', error);
      setError('Error fetching issued books. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, [userId]);

  return (
    <div>
      {/* Render your component UI here using the 'issuedBooks' state */}
    </div>
  );
}

export default UserInfoBookIssued;

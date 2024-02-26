import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../helper/firebaseConfig";

function MyBook() {
  const userId = localStorage.getItem("uid") || null;
  const [issuedBooks, setIssuedBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssuedBooks = async () => {
    try {
      const userDoc = doc(db, "myBook", userId);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log(userData)
        setIssuedBooks(userData);
      }

      setLoading(false);
    } catch (error) {
      setError("Error fetching issued books: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const handleReturnBook = async (bookId) => {
    try {
      const bookDetails = issuedBooks[bookId];

      console.log("bookDetails", bookDetails);
      console.log(bookId);

      // const userReturnDocRef = doc(db, "userReturn", userId, bookId);
      // await setDoc(userReturnDocRef, {
      //   bookDetails,
      //   returnDate: new Date().toISOString(), // You can customize the return date logic
      // });

      const userReturnCollection = collection(db, "userReturn");

      const userReturnDoc = doc(userReturnCollection, userId);

      // console.log("userReturnDoc",userReturnDoc)

      await setDoc(
        userReturnDoc,
        {
          [bookId]: { bookDetails, returnDate: Timestamp.now() },
        },
        { merge: true }
      );

      console.log("Book returned successfully!");
    } catch (error) {
      console.error("Error returning book:", error.message);
    }
  };

  return (
    <div className="my-book-container">
      <h2 className="my-book-title">My Issued Books</h2>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : Object.keys(issuedBooks).length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Sn</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Genre</th>
              <th>return</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(issuedBooks).map((bookId, index) => (
              <tr key={bookId}>
                <td>{index + 1}</td>
                <td>{issuedBooks[bookId].bookData.bookName}</td>
                <td>{issuedBooks[bookId].bookData.author}</td>
                <td>{issuedBooks[bookId].bookData.genre}</td>
                <td>
                  <button onClick={() => handleReturnBook(bookId)}>
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-issued-books-message">No issued books available</p>
      )}
    </div>
  );
}

export default MyBook;

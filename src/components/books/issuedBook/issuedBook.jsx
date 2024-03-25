import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../helper/firebaseConfig";
import "./issuedBook.css";
import ConfirmationDialog from "../../dialog/dialog";

function IssuedBook() {
  Modal.setAppElement("#root");
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("uid");
  const [refresh, setRefresh] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [returnApproveId, setReturnApproveId] = useState();

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      const myBooksCollection = collection(db, "myBook");
      const userBooksQuery = query(myBooksCollection, userId);
      try {
        const querySnapshot = await getDocs(userBooksQuery);
        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const idExists = books.some((entry) => entry.id === userId);

        if (idExists) {
          const targetObject = books.find((entry) => entry.id === userId);
          console.log(targetObject);
          setIssuedBooks(targetObject);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching issued books:", error);
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, [userId, refresh]);

  const handleReturnBook = async () => {
    try {
      const myBooksCollection = collection(db, "myBook");
      const userBookDoc = doc(myBooksCollection, userId);

      if (typeof issuedBooks === "object") {
        if (issuedBooks[returnApproveId]) {
          const issuedBook = issuedBooks[returnApproveId];
          const returnBookData = {
            book: issuedBook.bookData,
            returnDate: serverTimestamp(),
          };

          await updateDoc(userBookDoc, {
            [returnApproveId]: {
              ...issuedBook,
              returnStatus: true,
            },
          });

          const pendingApproveCollection = collection(
            db,
            "pending_approve_return"
          );
          const pendingApproveDoc = doc(pendingApproveCollection, userId);

          await setDoc(
            pendingApproveDoc,
            {
              [returnApproveId]: {
                returnBookData,
                returnStatus: true,
                returnDate: serverTimestamp(),
              },
            },
            { merge: true }
          );
          setIsDialogOpen(false);
        } else {
          console.log("Book not found in issuedBooks.");
        }
      } else if (Array.isArray(issuedBooks)) {
        const issuedBook = issuedBooks.find((book) => book[returnApproveId]);

        if (issuedBook) {
          const returnBookData = {
            book: issuedBook.bookData,
            returnDate: serverTimestamp(),
          };

          await updateDoc(userBookDoc, {
            [returnApproveId]: {
              ...issuedBook,
              returnStatus: true,
            },
          });

          const pendingApproveCollection = collection(
            db,
            "pending_approve_return"
          );
          const pendingApproveDoc = doc(pendingApproveCollection, userId);

          await setDoc(
            pendingApproveDoc,
            {
              [returnApproveId]: {
                returnBookData,
                returnStatus: true,
                returnDate: serverTimestamp(),
              },
            },
            { merge: true }
          );
          setIsDialogOpen(false);
        } else {
          console.log("Book not found in issuedBooks.");
        }
      }
      setRefresh((prevRefresh) => !prevRefresh);
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  const handleConformIssueReturn = (id) => {
    setReturnApproveId(id);
    setIsDialogOpen(true);
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      return date.toLocaleString("en-US", options);
    } else {
      return "No Date Available";
    }
  };

  var snn = 0;

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="data-table" border="2">
            <thead>
              <tr>
                <th>SN</th>
                <th>Title</th>
                <th>Author</th>
                {/* <th>Edition</th> */}
                <th>Issued Date</th>
                <th>Return Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks &&
                Object.entries(issuedBooks)
                  .filter(([id, book]) => book.bookData)
                  .sort(([idA, bookA], [idB, bookB]) => {
                    const returnStatusA = bookA.returnStatus || false;
                    const returnStatusB = bookB.returnStatus || false;
                    return returnStatusA === returnStatusB
                      ? 0
                      : returnStatusA
                      ? 1
                      : -1;
                  })
                  .map(([id, book]) => (
                    <tr key={id}>
                      <>
                        <td>{(snn += 1)}</td>
                        <td>{book.bookData.bookName}</td>
                        <td>{book.bookData.author}</td>
                        {/* <td>{book.bookData.edition}</td> */}
                        <td>{formatTimestamp(book.bookData.issueDate)}</td>
                        <td>
                          {book.returnStatus ? "pending" : "Yet to return"}
                        </td>
                        <td>
                          <button onClick={() => handleConformIssueReturn(id)}>
                            Return Book
                          </button>
                          <button onClick={() => openModal(book)}>
                            View Details
                          </button>
                        </td>
                      </>
                    </tr>
                  ))}
            </tbody>
          </table>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => closeModal()}
            contentLabel="Book Details Modal">
            <h2>Book Details</h2>
            {selectedBook && selectedBook.bookData && (
              <>
                <p>Title: {selectedBook.bookData.bookName}</p>
                <p>Author: {selectedBook.bookData.author}</p>
                <p>Edition: {selectedBook.bookData.edition}</p>
                <p>Edition: {selectedBook.bookData.edition}</p>
                <p>
                  Issued Date:{" "}
                  {formatTimestamp(selectedBook.bookData.issueDate)}
                </p>
                <p>
                  Return Status:{" "}
                  {selectedBook.returnStatus ? "pending" : "Yet to return"}
                </p>
              </>
            )}
            <button onClick={() => closeModal()}>Close</button>
          </Modal>

          <ConfirmationDialog
            isOpen={isDialogOpen}
            onCancel={() => setIsDialogOpen(false)}
            onConfirm={handleReturnBook}
            message="Return"
          />
        </>
      )}
    </>
  );
}

export default IssuedBook;

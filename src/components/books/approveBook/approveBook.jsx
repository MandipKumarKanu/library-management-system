import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../helper/firebaseConfig";
import "./approveBook.css";
import { DataTable } from "../../reactTable/reactTable";
import ConfirmationDialog from "../../dialog/dialog";

function ApproveBook() {
  const userId = localStorage.getItem("uid") || null;
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approveId, setApproveId] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchApprovedBooks = async () => {
    try {
      const approvedBooksCollection = collection(db, "approve_issued_books");
      const querySnapshot = await getDocs(approvedBooksCollection);

      const result = [];
      for (const doc2 of querySnapshot.docs) {
        const data = doc2.data();
        const userDoc = await getDoc(doc(db, "users", data.userId));
        const userName = userDoc.exists() ? userDoc.data().name : "Unknown";

        const approvedBook = {
          id: doc2.id,
          data: { ...data, userName },
        };
        result.push(approvedBook);
      }

      setApprovedBooks(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approved books:", error);
      setError("Error fetching approved books. Please try again later.");
      setLoading(false);
    }
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

  const moveToMyBook = async (approvedBookID) => {
    try {
      const approvedBookRef = doc(db, "approve_issued_books", approvedBookID);
      const approvedBookDoc = await getDoc(approvedBookRef);

      if (approvedBookDoc.exists()) {
        const bookRef = approvedBookDoc.data();
        const bookData = bookRef.data;
        const myBookCollection = collection(db, "myBook");
        const userBookDoc = doc(myBookCollection, bookRef.userId);

        await setDoc(
          userBookDoc,
          {
            [approvedBookID]: {
              bookData,
              approvedDate: Timestamp.now(),
              userId: bookRef.userId,
            },
          },
          { merge: true }
        );

        await deleteDoc(approvedBookRef);

        fetchApprovedBooks();
      }
    } catch (error) {
      console.error("Error moving book to MyBook:", error);
    }
  };

  const handleApprove = () => {
    moveToMyBook(approveId);
    setIsDialogOpen(false)
    console.log("Approving book:", approveId);
  };

  useEffect(() => {
    fetchApprovedBooks();
  }, []);

  const handleApproveConform = (id) => {
    setApproveId(id);
    setIsDialogOpen(true);
  };

  const allColumns = [
    {
      header: "User Name",
      accessorKey: "data.userName",
    },
    {
      header: "Book Name",
      accessorKey: "data.data.bookName",
    },
    {
      header: "Author",
      accessorKey: "data.data.author",
    },
    {
      header: "Genre",
      accessorKey: "data.data.genre",
    },
    {
      header: "Issue Date",
      accessorKey: "data.data.issueDate",
      cell: ({ value }) => formatTimestamp(value),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <button onClick={() => handleApproveConform(row.original.id)}>
          Approve
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="approved-book-container">
        <h2 className="approved-book-title">Approved Issued Books</h2>
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : approvedBooks && approvedBooks.length > 0 ? (
          <>
            {console.log(approvedBooks)}
            <DataTable columns={allColumns} data={approvedBooks} />
          </>
        ) : (
          <p className="no-approved-books-message">
            No approved books available
          </p>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={handleApprove}
        message="Approve"
      />
    </>
  );
}

export default ApproveBook;

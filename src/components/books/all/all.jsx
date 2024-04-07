import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAddBookHook } from "../../../hook/useAddBookHook";
import {
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
  getDoc,
  serverTimestamp,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../helper/firebaseConfig";
import { collection } from "firebase/firestore";
import { useLogin } from "../../../hook/useLoginHook";
import "./all.css";
import { DataTable } from "../../reactTable/reactTable";
// import { useTable } from 'react-table';
import { useReactTable } from "@tanstack/react-table";
import ConfirmationDialog from "../../dialog/dialog";
import AlertDialog from "../../dialog/alert";

function AllBooks() {
  const { formData, setFormData, error, coverImageHandler, coverImage } =
    useAddBookHook();
  const [books, setBooks] = useState([]);
  const dialogRef = useRef(null);
  const [updateBook, setUpdateBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, SetIsDeleteDialogOpen] = useState(false);
  const [bookId, setBookId] = useState(null);
  const uid = localStorage.getItem("uid");

  const [successUpdate, setSuccessUpdate] = useState(false);
  const [message, setMessage] = useState("");
  const [bookData, setBookData] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleSuccessUpdateClose = () => {
    setSuccessUpdate(false);
  };

  const fetchData = async () => {
    try {
      const booksCollection = collection(db, "books");
      const querySnapshot = await getDocs(booksCollection);

      const result = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const book = {
          bookId: doc.id,
          data: { ...data, id: doc.id },
        };
        result.push(book);
      });

      setBooks(result);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToWishlist = async () => {
    if (!uid) {
      console.log("No current user. Cannot add to wishlist.");
      return;
    }

    try {
      const userIssuedSummaryRef = doc(db, "userIssuedSummary", uid);
      const userIssuedSummaryDoc = await getDoc(userIssuedSummaryRef);

      let issuedBookIds = [];

      if (userIssuedSummaryDoc.exists()) {
        issuedBookIds = userIssuedSummaryDoc.data().issuedBooks || [];
        if (issuedBookIds.includes(bookData.bookId)) {
          setMessage("User has already issued this book.");
          setSuccessUpdate(true);
          setIsDialogOpen(false);
          console.log("User has already issued this book.");
          return;
        }
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      const issuedBooksCollection = collection(db, "approve_issued_books");
      const TotalIssueBooksCollection = collection(db, "total_issued_books");

      const { data, ...restOfBook } = bookData;
      const newData = {
        ...data,
        issueDate: serverTimestamp(),
      };
      const issuedBook = {
        ...restOfBook,
        data: newData,
        userId: uid,
        pendingApproved: true,
      };

      const totalIssuedBook = {
        ...issuedBook,
        userData: userDoc.data(),
      };

      const updatedNumberOfBooks = bookData.data.numberOfBooks - 1;

      await setDoc(userIssuedSummaryRef, {
        issuedBooks: [...issuedBookIds, bookData.bookId],
      });

      await addDoc(issuedBooksCollection, issuedBook);
      await addDoc(TotalIssueBooksCollection, totalIssuedBook);

      const bookRef = doc(db, "books", bookData.bookId);
      await updateDoc(bookRef, { numberOfBooks: updatedNumberOfBooks });

      setMessage("Book issued successfully");
      setSuccessUpdate(true);
      setIsDialogOpen(false);
      console.log("Book issued successfully:", issuedBook);
      fetchData();
    } catch (error) {
      setMessage("Error adding to wishlist");
      setSuccessUpdate(true);
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleIssueConfirmation = (book) => {
    setBookData(book);
    setIsDialogOpen(true);
  };

  const handleConfirmDialog = async () => {
    try {
      await deleteDoc(doc(db, "books", bookId));
      setMessage("Book deleted with ID:", bookId);
      setSuccessUpdate(true);
      console.log("Book deleted with ID:", bookId);
      fetchData();
    } catch (error) {
      setMessage("Error deleting book:", bookId);
      setSuccessUpdate(true);
      console.error("Error deleting book:", error);
    } finally {
      SetIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setBookId(id);
    SetIsDeleteDialogOpen(true);
  };

  const handleUpdateClick = (e, book) => {
    e.preventDefault();
    setUpdateBook({ ...book.data, id: book.id });
    setSelectedImage(null);
    dialogRef.current.showModal();
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      console.log(updateBook.id);
      const bookRef = doc(db, "books", updateBook.id);
      await updateDoc(bookRef, updateBook);
      setMessage("Book updated successfully");
      setSuccessUpdate(true);
      console.log("Book updated successfully!");
      fetchData();
      dialogRef.current.close();
    } catch (error) {
      setMessage("Error updating book:", error);
      setSuccessUpdate(true);
      console.error("Error updating book:", error);
    }
  };

  const allColumns = useMemo(
    () => [
      {
        header: "Book Name",
        accessorKey: "data.bookName",
      },
      {
        header: "Author",
        accessorKey: "data.author",
      },
      {
        header: "Genre",
        accessorKey: "data.genre",
      },
      {
        header: "Edition",
        accessorKey: "data.edition",
      },
      {
        header: "Publication Date",
        accessorKey: "data.publicationDate",
      },
      {
        header: "Number of Books",
        accessorKey: "data.numberOfBooks",
      },
      {
        header: "Book Shelf",
        accessorKey: "data.bookShelf",
      },
      {
        header: "Description",
        accessorKey: "data.description",
      },
      {
        header: "Cover Image",
        accessorKey: "data.coverImageURLs",
        cell: ({ row }) => (
          <>
            <img
              src={row.original.data.coverImageURLs[0]}
              alt={`Book Cover Image`}
              style={{ width: "auto", height: "100px" }}
            />
          </>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div>
            {/* {console.log(row)} */}

            {row.original.data.numberOfBooks > 0 && (
              <button onClick={() => handleIssueConfirmation(row.original)}>
                Add to Wishlist
              </button>
            )}
            <button
              onClick={() => handleDeleteConfirmation(row.original.bookId)}>
              Delete
            </button>
            <button
              onClick={(e) =>
                handleUpdateClick(e, {
                  id: row.original.bookId,
                  data: row.original.data,
                })
              }>
              Update
            </button>
            <button onClick={() => handleOpenDialog(row.original)}>
              View Details
            </button>
          </div>
        ),
      },
    ],
    [books]
  );

  const handleOpenDialog = (book) => {
    setSelectedBook(book);
  };

  return (
    <>
      <div className="all-books-container">
        <h2 className="all-books-title">All Books</h2>
        {console.log(books)}
        {books && books.length > 0 ? (
          <DataTable data={books} columns={allColumns} />
        ) : (
          <p className="no-books-message">No books available</p>
        )}
      </div>

      <dialog ref={dialogRef} className="AllDialogUpdate">
        {updateBook ? (
          <div className="add-book-container">
            <div className="add-book-form">
              <form onSubmit={handleUpdateBook}>
                <div className="form-group1">
                  <div className="form-group">
                    <label htmlFor="book-name">Book Name:</label>
                    <input
                      type="text"
                      value={updateBook.bookName}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          bookName: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="author">Author:</label>
                    <input
                      type="text"
                      value={updateBook.author}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          author: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="form-group1">
                  <div className="form-group">
                    <label htmlFor="genre">Genre:</label>
                    <input
                      type="text"
                      value={updateBook.genre}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          genre: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="number-of-books">Number of Books:</label>
                    <input
                      type="number"
                      value={updateBook.numberOfBooks}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          numberOfBooks: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="form-group1">
                  <div className="form-group">
                    <label htmlFor="bookshelf">Bookshelf:</label>
                    <input
                      type="text"
                      value={updateBook.bookshelf}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          bookshelf: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="publication-date">Publication Date:</label>
                    <input
                      type="text"
                      value={updateBook.publicationDate}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          publicationDate: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="form-group1">
                  <div className="form-group">
                    <label htmlFor="edition">Edition:</label>
                    <input
                      type="text"
                      value={updateBook.edition}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          edition: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Availability:</label>
                    <select
                      value={updateBook.availability}
                      onChange={(e) => {
                        setUpdateBook((old) => ({
                          ...old,
                          availability: e.target.value,
                        }));
                      }}>
                      <option value="available">Available</option>
                      <option value="checked-out">Checked Out</option>
                    </select>
                  </div>
                </div>

                {/* <div className="form-group1">
                  <div className="form-group2">
                    <div className="form-group">
                      <label htmlFor="cover-image">Book Cover Image:</label>
                      <input
                        id="coverImageInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setSelectedImage(e.target.files[0]);
                        }}
                      />
                    </div>
                    {(coverImage || selectedImage) && (
                      <img
                        className="img"
                        src={
                          selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : updateBook.coverImageURLs[0]
                        }
                        alt="Book Cover Image"
                      />
                    )}
                  </div>
                </div> */}

                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    value={updateBook.description}
                    onChange={(e) => {
                      setUpdateBook((old) => ({
                        ...old,
                        description: e.target.value,
                      }));
                    }}></textarea>
                </div>

                <button type="submit">Update Book</button>
              </form>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </div>
        ) : null}
      </dialog>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDialog}
        message="delete"
      />

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={addToWishlist}
        message="Issued"
      />

      <AlertDialog
        open={successUpdate}
        handleClose={handleSuccessUpdateClose}
        message={`${message}`}
      />

      {selectedBook && (
        <div className="dialog-container">
          <div className="dialog dialoggg">
            <h2>Book Details</h2>
            {/* <h2>Book Details</h2> */}
            {/* <img src={selectedBook.data.coverImageURLs} alt="" /> */}
            {selectedBook.data.coverImageURLs && (
              <div
                className="coverImageURLs"
                style={{
                  background: `url(${selectedBook.data.coverImageURLs})`,
                  height: "300px",
                  width: "300px",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}></div>
            )}

            <p>Book Name: {selectedBook.data.bookName}</p>
            <p>Author: {selectedBook.data.author}</p>
            <button onClick={() => setSelectedBook(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AllBooks;

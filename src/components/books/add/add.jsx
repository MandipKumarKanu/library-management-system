import React, { useState } from "react";
import { useAddBookHook } from "../../../hook/useAddBookHook";
import "./add.css";
import ConfirmationModal from "../../dialog/ConfirmationModal";

const AddBooks = () => {
  const {
    formData,
    setFormData,
    coverImageHandler,
    addBook,
    error,
    coverImage,
  } = useAddBookHook();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    bookName,
    author,
    genre,
    numberOfBooks,
    bookShelf,
    publicationDate,
    edition,
    description,
    availability,
  } = formData;

  const openModal = () => {
    if (!isEmptyField()) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmAddBook = () => {
    addBook();
    closeModal();
  };

  const isEmptyField = () => {
    return (
      bookName === "" ||
      author === "" ||
      genre === "" ||
      numberOfBooks === "" ||
      bookShelf === "" ||
      publicationDate === "" ||
      edition === "" ||
      description === "" ||
      availability === ""
    );
  };

  return (
    <div className="add-book-container">
      <div className="add-book-form">
        <form>
          <div className="form-group1">
            <div className="form-group">
              <label htmlFor="book-name">Book Name:</label>
              <input
                type="text"
                value={bookName}
                onChange={(e) =>
                  setFormData({ ...formData, bookName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                value={author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group1">
            <div className="form-group">
              <label htmlFor="genre">Genre:</label>
              <input
                type="text"
                value={genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="number-of-books">Number of Books:</label>
              <input
                type="number"
                value={numberOfBooks}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfBooks: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group1">
            <div className="form-group">
              <label htmlFor="bookshelf">Bookshelf:</label>
              <input
                type="text"
                value={bookShelf}
                onChange={(e) =>
                  setFormData({ ...formData, bookShelf: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="publication-date">Publication Date:</label>
              <input
                type="text"
                value={publicationDate}
                onChange={(e) =>
                  setFormData({ ...formData, publicationDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group1">
            <div className="form-group">
              <label htmlFor="edition">Edition:</label>
              <input
                type="text"
                value={edition}
                onChange={(e) =>
                  setFormData({ ...formData, edition: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="availability">Availability:</label>
              <select
                value={availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }>
                <option value="available">Available</option>
                <option value="checked-out">Checked Out</option>
              </select>
            </div>
          </div>

          <div className="form-group1">
            <div className="form-group2">
              <div className="form-group">
                <label htmlFor="cover-image">Book Cover Image:</label>
                <input
                  id="coverImageInput"
                  type="file"
                  accept="image/*"
                  onChange={coverImageHandler}
                />
              </div>
              {coverImage &&
                coverImage.length > 0 &&
                coverImage.map((img, index) => (
                  <img
                    key={index}
                    className="img"
                    src={URL.createObjectURL(img)}
                    alt={`Cover Image ${index + 1}`}
                  />
                ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              value={description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }></textarea>
          </div>

          <button type="button" onClick={openModal} disabled={isEmptyField()}>
            Add Book
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={closeModal}
        onConfirm={confirmAddBook}
      />
    </div>
  );
};

export default AddBooks;

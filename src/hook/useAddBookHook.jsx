import { useState } from "react";
import { storage, db } from "../helper/firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  addDoc,
} from "firebase/firestore";

export function useAddBookHook() {
  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    genre: "",
    numberOfBooks: Number(0),
    bookShelf: "",
    publicationDate: "",
    edition: "",
    description: "",
    availability: "",
  });

  const [coverImage, setCoverImage] = useState([]);
  const [error, setError] = useState("");

  const types = ["image/png", "image/jpeg"];

  const coverImageHandler = (e) => {
    let selectedFiles = e.target.files;
    let selectedFilesArray = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i] && types.includes(selectedFiles[i].type)) {
        selectedFilesArray.push(selectedFiles[i]);
      }
    }

    if (selectedFilesArray.length > 0) {
      setCoverImage(selectedFilesArray);
      setError("");
    } else {
      setCoverImage([]);
      setError("Please select valid image types: png, jpeg");
    }
  };

  const addBook = async () => {
    const uploadTasks = [];
    let downloadURLs = [];

    for (let i = 0; i < coverImage.length; i++) {
      const imgRef = ref(storage, `images/${coverImage[i].name}`);
      const imageData = uploadBytesResumable(imgRef, coverImage[i]);
      uploadTasks.push(imageData);
    }

    try {
      const uploadSnapshots = await Promise.all(uploadTasks);

      downloadURLs = await Promise.all(
        uploadSnapshots.map((snapshot) => getDownloadURL(snapshot.ref))
      );
    } catch (uploadError) {
      setError("Error Uploading Image");
      console.error(uploadError);
      return;
    }

    try {
      const bookDataRef = collection(db, "books");
      const newBookDocRef = await addDoc(bookDataRef, {
        ...formData,
        coverImageURLs: downloadURLs,
      });

      alert("Book Added");

      console.log("New Book ID:", newBookDocRef.id);

      setFormData({
        bookName: "",
        author: "",
        genre: "",
        numberOfBooks: "",
        bookShelf: "",
        publicationDate: "",
        edition: "",
        bookImg: null,
        description: "",
        availability: "",
      });
      setError("");
    } catch (addBookError) {
      setError("Error Adding Book");
      console.error(addBookError);
    }
  };

  return {
    formData,
    setFormData,
    coverImageHandler,
    addBook,
    error,
    coverImage,
  };
}

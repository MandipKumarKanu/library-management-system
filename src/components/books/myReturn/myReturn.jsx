import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../helper/firebaseConfig";

function MyReturn() {
  const [userReturnData, setUserReturnData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReturnData = async () => {
      try {
        // Assume you have the user ID stored in localStorage
        const userId = localStorage.getItem("uid");

        const myBooksCollection = collection(db, "myReturn");
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
            setUserReturnData(targetObject);
          }
        } catch (error) {
          console.error("Error fetching myReturn data:", error);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in fetchMyReturnData:", error);
      }
    };

    fetchMyReturnData();
  }, []);

  return (
    <>
      <h2>My Return Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Return Status</th>
              <th>Issued Date</th>
              <th>Return Date</th>
              <th>Book Name</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userReturnData).map(
              ([id, data]) =>
                // Check if data is valid before rendering the row
                data &&
                data.returnStatus !== undefined &&
                data.returnDate !== undefined && (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{data.returnStatus ? "Returned" : "Not Returned"}</td>
                    <td>
                      {data.returnBookData.book.issueDate
                        ? new Date(
                            data.returnBookData.book.issueDate.seconds * 1000
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {data.returnDate
                        ? new Date(
                            data.returnDate.seconds * 1000
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>{data.returnBookData.book.bookName}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

export default MyReturn;

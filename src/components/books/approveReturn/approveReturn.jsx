import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayRemove,
  getDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../helper/firebaseConfig";
import ConfirmationDialog from "../../dialog/dialog";

function ApproveReturn() {
  const [pendingReturns, setPendingReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({}); // Store user names

  const [documentId, setDocumentId] = useState("");
  const [bookId, setBookId] = useState();
  const [returnKey, setReturnKey] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "pending_approve_return")
        );
        const pendingReturnsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setPendingReturns(pendingReturnsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      const names = {};
      for (const item of pendingReturns) {
        const userName = await fetchUserName(item.id);
        names[item.id] = userName;
      }
      setUserNames(names);
      setLoading(false);
    };

    if (pendingReturns.length > 0) {
      fetchUserNames();
    }
  }, [pendingReturns]);

  const approveReturn = async () => {
    try {
      const returnDocRef = doc(db, "pending_approve_return", documentId);

      const returnDocSnapshot = await getDoc(returnDocRef);
      const removedData = returnDocSnapshot.data()[returnKey];

      await updateDoc(returnDocRef, {
        [returnKey]: arrayRemove(),
      });

      const myBookDocRef = doc(db, "myBook", documentId);
      await updateDoc(myBookDocRef, {
        [returnKey]: arrayRemove(),
      });

      const myReturnDocRef = doc(db, "myReturn", documentId);
      await setDoc(
        myReturnDocRef,
        {
          [returnKey]: removedData,
        },
        { merge: true }
      );

      const bookDocRef = doc(db, "books", bookId);
      const bookDocSnapshot = await getDoc(bookDocRef);
      let currentNumberOfBooks = bookDocSnapshot.data().numberOfBooks || 0;
      currentNumberOfBooks = Number(currentNumberOfBooks);
      const updatedNumberOfBooks = currentNumberOfBooks + 1;
      await updateDoc(bookDocRef, {
        numberOfBooks: updatedNumberOfBooks,
      });

      setPendingReturns((prevReturns) => {
        const updatedReturns = prevReturns.map((item) => {
          if (item.id === documentId) {
            const updatedData = { ...item.data };
            delete updatedData[returnKey];
            return { id: item.id, data: updatedData };
          }
          return item;
        });

        return updatedReturns;
      });

      const totalReturnCollectionRef = collection(db, "totalReturn");
      await addDoc(totalReturnCollectionRef, removedData);

      const userIssuedSummaryCollectionRef = collection(
        db,
        "userIssuedSummary"
      );
      const userIssuedSummaryDocRef = doc(
        userIssuedSummaryCollectionRef,
        documentId
      );

      if (bookId) {
        await updateDoc(userIssuedSummaryDocRef, {
          issuedBooks: arrayRemove(bookId),
        });
      }
      setIsDialogOpen(false);
      console.log(
        `Return with key ${returnKey} has been approved and saved to myReturn collection.`
      );
    } catch (error) {
      console.error("Error approving return:", error);
    }
  };

  const handleApproveReturn = (documentId, returnKey, bookId) => {
    setBookId(bookId);
    setDocumentId(documentId);
    setReturnKey(returnKey);
    setIsDialogOpen(true);
  };

  const fetchUserName = async (userId) => {
    try {
      const userColl = collection(db, "users");
      const userDoc = doc(userColl, userId);
      const userDocRef = await getDoc(userDoc);
      if (userDocRef.exists()) {
        const name = userDocRef.data().name;
        return name;
      } else {
        return "Unknown";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown";
    }
  };


  const dateChange = (date)=>{
    return ((new Date(date*1000)).toLocaleDateString())
  }


  let snnn = 0
  return (
    <>
      <h2>Pending Approve Returns</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>SN</th>
              {/* <th>ID</th> */}
              <th>User Name</th>
              <th>Book Name</th>
              {/* <th>Book Id</th> */}
              <th>Issued Date</th>
              <th>Return Date</th>
              {/* <th>Status</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingReturns.map((item) =>
              Object.entries(item.data).map(([key, value]) => {
                const hasReturnData =
                  value.returnBookData &&
                  Object.keys(value.returnBookData).length > 0;
                return (
                  hasReturnData && (
                    <>
                      {console.log(value.returnBookData)}
                      <tr key={key}>
                        <td>{snnn +=1}</td>
                        {/* <td>{item.id}</td> */}
                        <td>{userNames[item.id]}</td>
                        <td>{value.returnBookData?.book?.bookName || "N/A"}</td>
                        {/* <td>{value.returnBookData?.book?.id || "N/A"}</td> */}

                        <td>
                            {dateChange(value.returnBookData?.book?.issueDate.seconds) ||
                            "N/A"}
                        </td>
                        <td>
                          {dateChange(value.returnBookData?.returnDate?.seconds) || "N/A"}
                        </td>
                        {/* <td>{value.returnStatus ? "Approved" : "Pending"}</td> */}
                        <td>
                          <button
                            onClick={() =>
                              handleApproveReturn(
                                item.id,
                                key,
                                value.returnBookData?.book?.id
                              )
                            }>
                            Approve
                          </button>
                        </td>
                      </tr>
                    </>
                  )
                );
              })
            )}
          </tbody>
        </table>
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={approveReturn}
        message="Return?"
      />
    </>
  );
}

export default ApproveReturn;

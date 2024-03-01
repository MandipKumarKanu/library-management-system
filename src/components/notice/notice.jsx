import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  Timestamp,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../helper/firebaseConfig";
import Dialog from "./Dialog";
import "./Notice.css";

const Notice = ({ currentUser }) => {
  const userDocumentId = currentUser?.uid;
  const userD = localStorage.getItem("userD");
  const roleName = JSON.parse(userD).role;
  const [notices, setNotices] = useState([]);
  const [noticeText, setNoticeText] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [noticeStatus, setNoticeStatus] = useState(true);
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesCollection = collection(db, "notices");
        const unsubscribe = onSnapshot(noticesCollection, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotices(data);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const addNotice = async () => {
    try {
      if (!noticeText) {
        // Show an error message or handle the case where noticeText is empty
        return;
      }

      const noticesCollection = collection(db, "notices");
      const noticeData = {
        text: noticeText,
        date: noticeDate,
        status: noticeStatus,
        timestamp: Timestamp.now(),
      };

      if (editNoticeId) {
        await setDoc(doc(noticesCollection, editNoticeId), noticeData);
        setEditNoticeId(null);
      } else {
        await addDoc(noticesCollection, noticeData);
      }

      setNoticeText("");
      setNoticeDate("");
      setNoticeStatus(true);

      // Close the dialog after adding/editing notice
      closeDialog();
    } catch (error) {
      console.error("Error adding/editing notice:", error);
    }
  };

  const editNotice = (notice) => {
    setEditNoticeId(notice.id);
    setNoticeText(notice.text);
    setNoticeDate(notice.date);
    setNoticeStatus(notice.status);

    openDialog();
  };



  const deleteNotice = async (noticeId) => {
        try {
          const noticesCollection = collection(db, "notices");
          const noticeDoc = doc(noticesCollection, noticeId.id);
  
          await deleteDoc(noticeDoc);
        } catch (error) {
          console.error("Error deleting notice:", error);
        }
      };

  return (
    <div className="notice-container">
      <h2 className="notice-header">Notices</h2>
      {roleName === "admin" && (
        <div className="notice-form">
          <button onClick={openDialog}>
            {/* {editNoticeId ? "Edit Notice" : "Add Notice"} */}
            Add Notice
          </button>
        </div>
      )}
      {notices.length === 0 ? (
        <p>No notices available.</p>
      ) : (
        <ul className="notice-list">
          {notices.map((notice) =>
            roleName !== "admin" && notice.status === false ? null : (
              <li key={notice.id} className="notice-item">
                <div className="notice-text">{notice.text}</div>
                <div className="notice-details">
                  <div>Date: {notice.date}</div>
                  {roleName === "admin" && (
                    <div>Status: {notice.status.toString()}</div>
                  )}
                </div>
                {roleName === "admin" ? (
                  <div className="notice-actions">
                    <button onClick={() => editNotice(notice)}>Edit</button>
                    <button onClick={() => deleteNotice(notice)}>Delete</button>
                  </div>
                ) : null}
              </li>
            )
          )}
        </ul>
      )}
      
      <Dialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={addNotice}
        title={editNoticeId ? "Edit Notice" : "Add Notice"}
        // className="edit-add-notice"
      >
        <textarea
          placeholder="Notice Text"
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          required
        />
        <div className="one-line">
          <input
            type="date"
            placeholder="Notice Date"
            value={noticeDate}
            onChange={(e) => setNoticeDate(e.target.value)}
          />
          <select
            name="status"
            value={noticeStatus}
            onChange={(e) => setNoticeStatus(e.target.value === "true")}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>
      </Dialog>
    </div>
  );
};

export default Notice;

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  setDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../helper/firebaseConfig";

import "./ChatPage.css";

const ChatPage = ({ currentUser, isAdmin }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userDocIds, setUserDocIds] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [selectedUserDocId, setSelectedUserDocId] = useState(null);
  const [isConversationStarted, setConversationStarted] = useState(false);
  const userDocumentId = currentUser?.uid;
  const userD = localStorage.getItem("userD");
  const roleName = JSON.parse(userD).role;
  const [showEmptyMessageTooltip, setShowEmptyMessageTooltip] = useState(false);

  // console.log(roleName);
  const messageListRef = useRef(null);


  useEffect(() => {
    const fetchUserDocIdsAndNames = async () => {
      try {
        const messagesCollection = collection(db, "messages");
        const querySnapshot = await getDocs(messagesCollection);

        const docIds = querySnapshot.docs.map((doc) => doc.id);
        setUserDocIds(docIds);

        const userNamesMap = {};
        for (const docId of docIds) {
          const userDoc = await getDoc(doc(collection(db, "users"), docId));
          const userName = userDoc.data()?.name || "Unknown";
          userNamesMap[docId] = userName;
        }
        setUserNames(userNamesMap);

        if (docIds.includes(userDocumentId)) {
          setSelectedUserDocId(userDocumentId);
          setConversationStarted(true);
        } else if (docIds.length > 0) {
          setSelectedUserDocId(docIds[0]);
        }
      } catch (error) {
        console.error("Error fetching user document IDs:", error);
      }
    };

    fetchUserDocIdsAndNames();
  }, [userDocumentId]);

  useEffect(() => {
    if (selectedUserDocId) {
      const userMessagesDocument = doc(
        collection(db, "messages"),
        selectedUserDocId
      );

      const unsubscribe = onSnapshot(userMessagesDocument, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data().messages || [];
          setMessages(data);
        } else {
          setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedUserDocId]);


  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);


  const startNewConversation = async () => {
    try {
      const messagesCollection = collection(db, "messages");
      const userMessagesDocument = doc(messagesCollection, userDocumentId);

      const messageData = {
        sender: currentUser?.name || "unknown",
        message: "Conversation started",
        timestamp: Timestamp.now(),
      };

      await setDoc(userMessagesDocument, { messages: [messageData] });

      setNewMessage("");
      setSelectedUserDocId(userDocumentId);
      setConversationStarted(true);
    } catch (error) {
      console.error("Error starting new conversation:", error);
    }
  };

  const sendMessage = async () => {
    try {
      if (!newMessage.trim()) {
        setShowEmptyMessageTooltip(true);
        return;
      }
      const messagesCollection = collection(db, "messages");
      const userMessagesDocument = doc(messagesCollection, selectedUserDocId);

      const messageData = {
        sender: currentUser?.name || "unknown",
        message: newMessage,
        timestamp: Timestamp.now(),
      };

      await setDoc(userMessagesDocument, {
        messages: [...messages, messageData],
      });

      setNewMessage("");
      setConversationStarted(true);
      setShowEmptyMessageTooltip(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      {roleName === "admin" && (
        <div className="user-list">
          <h2>User List</h2>
          {userDocIds.length === 0 ? (
            <p>No users available.</p>
          ) : (
            <ul>
              {userDocIds.map((docId) => (
                <li
                  key={docId}
                  onClick={() => setSelectedUserDocId(docId)}
                  className={
                    docId === selectedUserDocId ? "selected-user" : ""
                  }>
                  {userNames[docId]}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="chat">
        <h1>Chat Page</h1>
        {isConversationStarted ? (
          <div className="conversation">
            <h2>Messages for Admin: {userNames[selectedUserDocId]}</h2>
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              <div className="message-list" ref={messageListRef}>
                {" "}
                {messages.map((message, index) => (
                  <div key={index} className="message">
                    <strong>{message.sender}:</strong> {message.message}
                  </div>
                ))}
              </div>
            )}
            <div className="input-box">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                aria-required
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            <center>
              {" "}
              {showEmptyMessageTooltip ? "Message cannot be empty" : ""}
            </center>
          </div>
        ) : (
          <button onClick={startNewConversation} className="start-btn">
            Start Conversation
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

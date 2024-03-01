import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./components/signUp/signUp";
import AddBooks from "./components/books/add/add";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";
import ProtectedRoute from "./util/protectedRoute";
import AllBooks from "./components/books/all/all";
import AllUsers from "./components/users/allUsers";
import IssuedBook from "./components/books/issuedBook/issuedBook";
import ReturnedBook from "./components/books/returnedBook/returnedBook";
import ApproveBook from "./components/books/approveBook/approveBook";
import UserInfoBookIssued from "./components/books/issuedBook/userInfoBookIssued";
import MyBook from "./components/users/myBook/myBook";
import ApproveReturn from "./components/books/approveReturn/approveReturn";
import Getdata from "./components/books/approveReturn/getdata";
import MyReturn from "./components/books/myReturn/myReturn";
import AllReturn from "./components/books/allReturn/allReturn";
import AllIssued from "./components/books/allIssued/allIssued";
import ChatPage from "./components/support/support";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./helper/firebaseConfig";
import Notice from "./components/notice/notice";
import MyProfile from "./components/users/myProfile/myProfile";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // New state to track admin status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? { uid: user.uid, name: user.displayName, role: "no" } : null);

      // Set admin status based on the user's role
      setIsAdmin(user?.role === "admin");
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/addbook" element={<AddBooks />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/allbook" element={<AllBooks />} />
            <Route path="/totalmember" element={<AllUsers />} />
            <Route path="/issuedBook" element={<IssuedBook />} />
            <Route path="/issue" element={<UserInfoBookIssued />} />
            <Route path="/returned" element={<MyReturn />} />
            <Route path="/approve" element={<ApproveBook />} />
            <Route path="/approveReturn" element={<ApproveReturn />} />
            <Route path="/gd" element={<Getdata />} />
            <Route path="/myBook" element={<MyBook />} />
            <Route path="/allreturn" element={<AllReturn />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/notice" element={<Notice currentUser={currentUser}/>} />
            <Route
              path="/ChatPage"
              element={
                currentUser ? (
                  <ChatPage currentUser={currentUser} isAdmin={isAdmin} />
                ) : (
                  <p>Please log in to access the chat.</p>
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

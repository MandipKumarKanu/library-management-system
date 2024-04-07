import React, { useState, useEffect } from "react";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../../../hooks/useSignupHook";
import { auth, signOut } from "../../../helper/firebaseConfig";

import {
  faHome,
  faBook,
  faUsers,
  faUser,
  faCaretDown,
  faListAlt,
  faClipboardList,
  faUndo,
  faCheckSquare,
  faBars,
  faTimes,
  faHeadset,
  faComments,
  faBell,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  const [dropLi, setDropLi] = useState(false);

  const handleDrop = () => {
    setDropLi(!dropLi);
  };

  const role = JSON.parse(localStorage.getItem("userD")).role || "";
  const profileImg = localStorage.getItem("profileImg");
  // console.log(role)
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      console.log("logout done");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section id="sidebar" className={isOpen ? "open" : "minimized"}>
        {/* <button className="hamburger-icon" onClick={toggleSidebar}> */}
        {/* <FontAwesomeIcon icon={isOpen ? faTimes : faBars} /> */}
        {/* </button> */}
        <div className="sidebar">
          <div className="s-up">
            <div className="s-user">
              <div className="s-user-l">
                {profileImg ? (
                  <div
                    className="s-user-img"
                    style={{
                      background: `url(${profileImg})`,
                      // backgroundPosition: `center`,
                      // backgroundSize: `contain`,
                      height: `50px`,
                      width: `50px`,
                      borderRadius: `50%`,
                    }}></div>
                ) : (
                  " "
                )}
              </div>
              <div className="s-user-r">
                <div className="s-user-name">
                  {currentUser ? currentUser.displayName : "null"}
                </div>
                <div className="s-user-level">{role}</div>
              </div>
            </div>
          </div>

          <div className="s-down">
            <ul>
              <li>
                <Link to={`/`}>
                  <FontAwesomeIcon icon={faHome} /> Dashboard
                </Link>
              </li>

              <li className={`${dropLi ? "drop-li" : ""}`}>
                <details>
                  <summary onClick={handleDrop}>
                    <div>
                      <FontAwesomeIcon icon={faBook} /> Book
                    </div>
                    <FontAwesomeIcon icon={faCaretDown} className="drop-down" />
                  </summary>
                  <ol>
                    {role === "admin" && (
                      <li>
                        <Link to={`/addbook`}>
                          <FontAwesomeIcon icon={faListAlt} /> Add Book
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to={`/allbook`}>
                        <FontAwesomeIcon icon={faListAlt} /> All Book
                      </Link>
                    </li>
                    <li>
                      <Link to={`/issuedbook`}>
                        <FontAwesomeIcon icon={faClipboardList} /> Issued
                        Book(user)
                      </Link>
                    </li>
                    {role === "admin" && (
                      <li>
                        <Link to={`/approveReturn`}>
                          <FontAwesomeIcon icon={faUndo} /> Yet to return Book
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to={`/returned`}>
                        <FontAwesomeIcon icon={faCheckSquare} /> Returned Book
                      </Link>
                    </li>
                    {role === "admin" && (
                      <li>
                        <Link to={`/approve`}>
                          <FontAwesomeIcon icon={faCheckSquare} /> approve Book
                        </Link>
                      </li>
                    )}
                  </ol>
                </details>
              </li>

              {role === "admin" && (
                <li>
                  <Link to={`/totalmember`}>
                    <FontAwesomeIcon icon={faUsers} /> Users
                  </Link>
                </li>
              )}

              <Link to={`/profile`}>
                <FontAwesomeIcon icon={faUser} /> My Profile
              </Link>
            </ul>
          </div>

          <div className="s-btm">
            <ul>
              {/* <li>
                <Link to={`/chatpage`}>
                  <FontAwesomeIcon icon={faComments} />
                </Link>
              </li> */}
              <li>
                <Link to={`/notice`}>
                  <FontAwesomeIcon icon={faBell} />
                </Link>
              </li>
              <li onClick={logOut}>
                {/* <Link to={`/`}> */}
                <FontAwesomeIcon icon={faRightFromBracket} />

                {/* </Link> */}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Sidebar;

import React, { useState, useEffect } from "react";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../../../hooks/useSignupHook";
import { auth } from "../../../helper/firebaseConfig";

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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Sidebar({isOpen,toggleSidebar}) {
  const [dropLi, setDropLi] = useState(false);

  const handleDrop = () => {
    setDropLi(!dropLi);
  };

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
                <div
                  className="s-user-img"
                  style={{
                    height: `50px`,
                    width: `50px`,
                    borderRadius: `50%`,
                  }}></div>
              </div>
              <div className="s-user-r">
                <div className="s-user-name">
                  {currentUser ? currentUser.displayName : "null"}
                </div>
                <div className="s-user-level">ADMIN</div>
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
                    <li>
                      <Link to={`/addbook`}>
                        <FontAwesomeIcon icon={faListAlt} /> Add Book(admin)
                      </Link>
                    </li>
                    <li>
                      <Link to={`/allbook`}>
                        <FontAwesomeIcon icon={faListAlt} /> All
                        Book(admin/user)
                      </Link>
                    </li>
                    <li>
                      <Link to={`/issuedbook`}>
                        <FontAwesomeIcon icon={faClipboardList} /> Issued
                        Book(user)
                      </Link>
                    </li>
                    <li>
                      <Link to={`/approveReturn`}>
                        <FontAwesomeIcon icon={faUndo} /> Yet to return
                        Book(admin)
                      </Link>
                    </li>
                    <li>
                      <Link to={`/returned`}>
                        <FontAwesomeIcon icon={faCheckSquare} /> Returned Book
                      </Link>
                    </li>
                    <li>
                      <Link to={`/approve`}>
                        <FontAwesomeIcon icon={faCheckSquare} /> approve
                        Book(admin)
                      </Link>
                    </li>
                  </ol>
                </details>
              </li>

              <li>
                <Link to={`/totalmember`}>
                  <FontAwesomeIcon icon={faUsers} /> Users
                </Link>
              </li>

              <li>
                <FontAwesomeIcon icon={faUser} /> My Profile
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
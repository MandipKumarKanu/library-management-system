import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faUsersGear,
  faBell,
  faSwatchbook,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";  
import { app } from "../../helper/firebaseConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const auth = getAuth(app);

function Dashboard() {
  // const { currentUser } = useLoginContext();
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
      <section id="dashboard">
        <div className="dashboard">
          <div className="d-up">
            {/* <p>Welcome, {currentUser.email}</p> */}
            <p>Welcome, {currentUser ? currentUser.displayName : "null"}</p>
            <div className="du-up">Libray Management Control Pannel</div>
            <div className="du-btm">
              <div className="dash-card-container">
                <div className="dash-card">
                  <Link to={`/totalmember`}>
                    <div className="d-card-u">
                      <FontAwesomeIcon
                        icon={faUsersGear}
                        className="dash-ico"
                      />
                    </div>
                    <div className="d-card-b">
                      <div className="d-num">5</div>
                      <div className="d-content">Total Member</div>
                    </div>
                  </Link>
                </div>

                <div className="dash-card">
                  <Link to={`/totalbook`}>
                    <div className="d-card-u">
                      <FontAwesomeIcon
                        icon={faSwatchbook}
                        className="dash-ico"
                      />
                    </div>
                    <div className="d-card-b">
                      <div className="d-num">4</div>
                      <div className="d-content">Total Books</div>
                    </div>
                  </Link>
                </div>

                <div className="dash-card">
                  <Link to={`/issuedbook`}>
                    <div className="d-card-u">
                      <FontAwesomeIcon icon={faBookOpen} className="dash-ico" />
                    </div>
                    <div className="d-card-b">
                      <div className="d-num">3</div>
                      <div className="d-content">Issued Books</div>
                    </div>
                  </Link>
                </div>

                <div className="dash-card">
                  <Link to={`/totalrequest`}>
                    <div className="d-card-u">
                      <FontAwesomeIcon icon={faBell} className="dash-ico" />
                    </div>
                    <div className="d-card-b">
                      <div className="d-num">2</div>
                      <div className="d-content">View Request</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="d-btm"></div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;

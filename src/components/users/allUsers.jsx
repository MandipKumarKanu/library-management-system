import React, { useEffect, useState } from "react";
import { useSignupHook } from "../../hook/useSignUpHook";
import { doc, deleteDoc } from "firebase/firestore";
import {  deleteUser,auth, db } from "../../helper/firebaseConfig";
import "./AllUsers.css";

function AllUsers() {
  const { getUser } = useSignupHook();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUser();
        setUsers(result);
        console.log("User Data:", result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  async function handelDelete(uid) {
    try {
      await deleteDoc(doc(db, "users", `${uid}`));

      try {
        await deleteUser(uid).then(() => {
          console.log("User deleted with id: ", uid);
        }).catch((error) => {
          console.log("Error deleting user", error.message);
        });
      } catch (error) {
        console.log("Error deleting user", error.message);
      }

      const updatedUsers = await getUser();
      console.log("delete", uid);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <div className="all-users-container">
      <h2>All Users</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Faculty</th>
            <th>Semester</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.faculty}</td>
              <td>{user.semester}</td>
              <td><button onClick={() => handelDelete(user.uid)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllUsers;
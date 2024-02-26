import React, { useState } from "react";
import "./signUp.css";
import { useSignupHook } from "../../hook/useSignUpHook";

function SignUp() {
  const { formData, setFormData, passwordMatch, signUp } = useSignupHook();

  const { name, email, password, confirmPassword, faculty, semester } =
    formData;
    return (
      <div className="sign-up-container">
        <form onSubmit={signUp} className="sign-up-form">
          <h3>
            <center>Sign Up</center>
          </h3>
  
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
  
          <div className="form-group">
            <div className="form-group-row">
              <div className="form-group-half">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
  
              <div className="form-group-half">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            {!passwordMatch && (
              <div className="error-message-pw">
                <center>Passwords do not match</center>
              </div>
            )}
          </div>
  
          <div className="form-group">
            <div className="form-group-row">
              <div className="form-group-half">
                <label htmlFor="faculty">Faculty</label>
                <select
                  name="faculty"
                  id="faculty"
                  value={faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  required
                >
                  <option value="" disabled>
                    Select Faculty
                  </option>
                  <option value="bca">BCA</option>
                  <option value="csit">Bsc CSIT</option>
                </select>
              </div>
  
              <div className="form-group-half">
                <label htmlFor="Semester">Semester</label>
                <select
                  name="semester"
                  id="Semester"
                  value={semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                >
                  <option value="" disabled>
                    Select Semester
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>
          </div>
  
          <button type="submit">Sign Up</button>
          </form>
      </div>
    );
  }
  
  export default SignUp;
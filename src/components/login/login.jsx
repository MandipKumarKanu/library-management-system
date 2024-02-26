import React, { useState } from "react";
import "./login.css";
import { useLogin } from "../../hook/useLoginHook";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <>
      <section id="login">
        <div className="login">
          <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div className="form-grp">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="form-grp">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div className="form-grp">
              <button type="submit" disabled={loading}>
                Login
              </button>
              {error && (
                <div className="error-message">
                  <center>{error}</center>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Reset = () => {
  const [data, setData] = useState({
    email: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(data);

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(data.email);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  };
  return (
    <>
      {error && <h1>{error}</h1>}
      {message && <h1>{message}</h1>}
      <form onSubmit={onSubmitHandler}>
        <h1>Reset Password</h1>
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={data.email}
            className="form-input"
            onChange={onChangeHandler}
          />
        </div>

        <div>
          <input type="submit" value="Reset Password" disabled={loading} />
        </div>
      </form>
      <div>
        <Link to="/">Log in</Link>
      </div>
      <div>
        <p>Don't have an account?</p>
        <Link to="/signup">Sign up</Link>
      </div>
    </>
  );
};

export default Reset;

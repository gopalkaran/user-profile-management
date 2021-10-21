import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from '../styles/Login.module.css';

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const history = useHistory();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(data);

    try {
      setError("");
      setLoading(true);
      await login(data.email, data.password);
      history.push("/dashboard");
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  };
  return (
    <>
    <div className={styles.container}>
    
      <form onSubmit={onSubmitHandler} className={styles.form}>
        <h1>Log in</h1>
        <div className={styles.formGroup}>
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
        <div className={styles.formGroup}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="text"
            name="password"
            value={data.password}
            className="form-input"
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <input type="submit" value="Login" disabled={loading} />
        </div>
      </form>
      <div>
        <Link to="/reset">Forgot password?</Link>
      </div>
      </div>
      <div className={styles.signUp}>
        <p>Don't have an account?</p>
        <Link to="/signup">Sign up</Link>
      </div>
      <div className={styles.error}>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default Login;

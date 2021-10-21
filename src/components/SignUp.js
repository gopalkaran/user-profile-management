import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import app from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/SignUp.module.css";

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const db = getFirestore(app);

  const history = useHistory();

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(data);

    try {
      setError("");
      setLoading(true);
      const user = await signup(data.email, data.password);
      console.log(user.user.uid);
      const user_id = user.user.uid;
      addToDatabase(data, user_id);
      history.push("/dashboard");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  };

  const addToDatabase = async (data, u_id) => {
    await setDoc(doc(db, "users", u_id), data);
  };

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={onSubmitHandler} className={styles.container}>
        <h1>Sign up</h1>
        <div className={styles.formGroup}>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            className="form-input"
            onChange={onChangeHandler}
          />
        </div>
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
          <input type="submit" value="Sign Up" disabled={loading} />
        </div>
      </form>
      <div className={styles.login}>
        <p>Have an account?</p>
        <Link to="/">Log in</Link>
      </div>
    </>
  );
};

export default SignUp;

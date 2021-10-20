import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import app from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

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
      await signup(data.email, data.password);
      history.push("/dashboard");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);

    addToDatabase(data);
  };

  const addToDatabase = async (data) => {
    const t_Id = new Date().getTime().toString();
    console.log(t_Id);

    await setDoc(doc(db, "users", t_Id), data);
  };

  return (
    <>
    {error && <h1>{error}</h1>}
      <form onSubmit={onSubmitHandler}>
        <h1>Sign up</h1>
        <div>
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
      <div>
        <p>Have an account?</p>
        <Link to="/">Log in</Link>
      </div>
    </>
  );
};

export default SignUp;

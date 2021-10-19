import React, { useState } from "react";
import { Link } from "react-router-dom";
import app from "../config/firebase";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(data);
    addToDatabase(data);
  };

  // const addToDatabase = (data) => {
  //   const t_Id = new Date().getTime().toString();
  //   console.log(t_Id);
  //   db.collection("users")
  //     .doc(t_Id)
  //     .set(data)
  //     .then(() => {
  //       console.log("User successfully stored!");
  //     })
  //     .catch((error) => {
  //       console.error("Error storing user: ", error);
  //     });
  // };

  const addToDatabase = async (data) => {
    const t_Id = new Date().getTime().toString();
    console.log(t_Id);

    // Add a new document in collection "cities"
    await setDoc(doc(db, "users", t_Id), data);
  };

  return (
    <>
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
          <input type="submit" value="Sign Up" />
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

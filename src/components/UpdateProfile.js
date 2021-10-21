import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import app from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/UpdateProfile.module.css";

const UpdateProfile = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, updateEmailId, updatePass } = useAuth();
  const db = getFirestore(app);

  const history = useHistory();

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(data);

    console.log(currentUser);
    console.log(currentUser.email);

    const promises = [];

    setError("");
    setLoading(true);

    if (data.email !== currentUser.email && data.email !== "") {
      console.log(currentUser.email, "=" , data.email);
      promises.push(updateEmailId(data.email));
      
      // console.log(data.email);
    }

    if (data.password) {
      console.log(data.password);
      promises.push(updatePass(data.password));
    }

    Promise.all(promises)
      .then(() => {
        console.log(currentUser.email);
        updateToDatabase(data, currentUser.uid);
        history.push("/dashboard");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateToDatabase = async (data, u_id) => {
    const userRef = doc(db, "users", u_id);
    
    await updateDoc(userRef, data);
  };


  useEffect(() => {
    console.log("user_id: ", currentUser.uid);
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      console.log("Current data: ", doc.data());
      const user = doc.data();
      const {name , email, password} = user;
      setData({name : name, email : email, password : password});
    });
    return unsub;
  }, []);

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={onSubmitHandler} className={styles.container}>
        <h1>Update Profile</h1>
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
          <input type="submit" value="Update" disabled={loading} />
        </div>
      </form>
      <div className={styles.cancel}>
        <Link to="/dashboard">Cancel</Link>
      </div>
    </>
  );
};

export default UpdateProfile;

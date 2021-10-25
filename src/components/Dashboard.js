import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import app from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import styles from "../styles/Dashboard.module.css";


const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [uploaded, setUploaded] = useState(false);

  const [data, setData] = useState({
    address: "",
    dob: "",
    image : {
      name : '',
      path : ''
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const fileChangedHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  const uploadHandler = () => {
    if(selectedFile){
    console.log(selectedFile);
    const bucketName = "profile-picture"
    const file = selectedFile;
    const storageRef = ref(storage, `${bucketName}/${file.name}`);

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      setUploaded(true);
      setTimeout(() => {
        setUploaded(false);
      }, 3000);
      getDownloadURL(ref(storage, `${bucketName}/${file.name}`)).then((url)=>{
         console.log(url);
         setData({...data, image: {name: file.name , path: url}});
      })
    });
  }

  }

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(data);
    if(data.address && data.dob && data.image.name && data.image.path){

    try {
      setError("");
      setLoading(true);
      // const user = await signup(data.email, data.password);
      // console.log(user.user.uid);
      // const user_id = user.user.uid;
      updateToDatabase(data, currentUser.uid);
      history.push("/dashboard");
    } catch {
      setError("Failed to update the Database");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
    setLoading(false);
  }
  };

  const updateToDatabase =async (data, u_id) => {
    const userRef = doc(db, "users", u_id);

    await updateDoc(userRef, data);
  };

  const history = useHistory();
  const db = getFirestore(app);
  const storage = getStorage(app);


  const signoutUser = async () => {
    setError("");
    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    console.log("user_id: ", currentUser.uid);
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      console.log("Current data: ", doc.data());
      const user = doc.data();
      setUserDetails(user);
    });
    return unsub;
  }, [db, currentUser.uid]);

  return (
    <>
    <div className={styles.detailContainerTop}>
      <h1>Profile</h1>
      {error && <div className={styles.error}>{error}</div>}
      {uploaded && <div className={styles.error}>Image uploaded successfully</div>}
      <div className={styles.userDetailField}><span>Name : </span> {userDetails && <strong>{userDetails.name}</strong>}</div>
      <div className={styles.userDetailField}><span>Email : </span> {userDetails && <strong>{userDetails.email}</strong>}</div>
      </div>
      {userDetails.address && userDetails.dob && userDetails.image ? <div className={styles.detailContainerBottom}>
            <div className={styles.userDetailField}><span>Address : </span> {userDetails && <strong>{userDetails.address}</strong>}</div>
            <div className={styles.userDetailField}><span>DOB : </span> {userDetails && <strong>{userDetails.dob}</strong>}</div>
            <div className={styles.userDetailField}><img src={userDetails.image.path} alt={userDetails.image.name} style={{height: '200px', width:'200px'}}></img></div>
            </div>
            
            : 
      
    
      <form onSubmit={onSubmitHandler} className={styles.container}>
        <h1>Profile Details</h1>
        <div className={styles.formGroup}>
          <label htmlFor="name" className="form-label">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={data.address}
            className="form-input"
            onChange={onChangeHandler}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className="form-label">
            Date of Birth
          </label>
          <input
            type="text"
            name="dob"
            value={data.dob}
            className="form-input"
            onChange={onChangeHandler}
          />
        </div>
        <div className={styles.formGroup}>
          <input type="file" id="image" name="image" onChange={fileChangedHandler} />
          <input type="button" value="Upload" onClick={uploadHandler} />
        </div>
        <div>
          <input type="submit" value="Save" disabled={loading} />
        </div>
      </form>
}
      <div className={styles.signout}>
      <Link to="/update-profile">Update Profile</Link>
      </div>
      <div className={styles.signout}>
        <button onClick={signoutUser}>Sign out</button>
      </div>
    </>
  );
};

export default Dashboard;

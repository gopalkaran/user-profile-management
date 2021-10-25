import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import app from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/UpdateProfile.module.css";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";


const UpdateProfile = () => {
  const [data, setData] = useState({
    name: "",
    address: "",
    dob: "",
    image : {
      name : '',
      path : ''
    }
  });


  const [uploaded, setUploaded] = useState(false);

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


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const db = getFirestore(app);
  const storage = getStorage(app);


  const history = useHistory();

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // const onSubmitHandler = (e) => {
    // e.preventDefault();
    // console.log(data);

    // console.log(currentUser);
    // console.log(currentUser.email);

    // const promises = [];

    // setError("");
    // setLoading(true);

    // if (data.email !== currentUser.email && data.email !== "") {
    //   console.log(currentUser.email, "=" , data.email);
    //   promises.push(updateEmailId(data.email));
      
    //   // console.log(data.email);
    // }

    // if (data.password) {
    //   console.log(data.password);
    //   promises.push(updatePass(data.password));
    // }

    // Promise.all(promises)
    //   .then(() => {
    //     console.log(currentUser.email);
    //     updateToDatabase(data, currentUser.uid);
    //     history.push("/dashboard");
    //   })
    //   .catch(() => {
    //     setError("Failed to update account");
    //     setTimeout(() => {
    //       setError("");
    //     }, 3000);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  // };


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(data);
    if(data.name && data.address && data.dob && data.image.name && data.image.path){

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

  const updateToDatabase = async (data, u_id) => {
    const userRef = doc(db, "users", u_id);
    
    await updateDoc(userRef, data);
  };


  useEffect(() => {
    console.log("user_id: ", currentUser.uid);
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      console.log("Current data: ", doc.data());
      const user = doc.data();
      const {name , address, dob} = user;
      setData({name : name, address : address, dob : dob});
    });
    return unsub;
  }, []);

  return (
    <>
      {error && <div className={styles.error}>{error}</div>}
      {uploaded && <div className={styles.error}>Image uploaded successfully</div>}

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
          <label htmlFor="address" className="form-label">
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
          <label htmlFor="dob" className="form-label">
            DOB
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

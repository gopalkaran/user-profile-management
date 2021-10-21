import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import app from "../config/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";


const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({});

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
      setError("Failed to create an account");
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
  }, []);

  return (
    <>
      <h1>Profile</h1>
      {error && <h1>{error}</h1>}
      <div>Name : {userDetails && <strong>{userDetails.name}</strong>}</div>
      <div>Email : {userDetails && <strong>{userDetails.email}</strong>}</div>
      {userDetails.address && userDetails.dob && userDetails.image ? <>
            <div>Address : {userDetails && <strong>{userDetails.address}</strong>}</div>
            <div>DOB : {userDetails && <strong>{userDetails.dob}</strong>}</div>
            <div><img src={userDetails.image.path} style={{height: '200px', width:'200px'}}></img></div>
            </>
            : 
      
    
      <form onSubmit={onSubmitHandler}>
        <h1>Profile Details</h1>
        <div>
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
        <div>
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
        <div>
          <input type="file" id="image" name="image" onChange={fileChangedHandler} />
          <input type="button" value="Upload" onClick={uploadHandler} />
        </div>
        <div>
          <input type="submit" value="Save" disabled={loading} />
        </div>
      </form>
}
      <Link to="/update-profile">Update Profile</Link>
      <div>
        <button onClick={signoutUser}>Sign out</button>
      </div>
    </>
  );
};

export default Dashboard;

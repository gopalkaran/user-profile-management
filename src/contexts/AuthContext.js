import React, { useContext, useState, useEffect } from "react";
import app from "../config/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword
} from "firebase/auth";

const AuthContext = React.createContext();

const auth = getAuth(app);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  // const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
      return signInWithEmailAndPassword(auth, email, password);
  }

  function logout(){
      return signOut(auth);
  }

  function resetPassword(email){
      return sendPasswordResetEmail(auth, email);
  }


  function updateEmailId(email){
      return updateEmail(currentUser, email);
  }

  function updatePass(password){
    return updatePassword(currentUser, password);

  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
        setCurrentUser(user);
        // setLoading(false);
        
      } else {
        // User is signed out
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmailId,
    updatePass
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

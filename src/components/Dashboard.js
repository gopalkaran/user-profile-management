import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");

  const history = useHistory();

  const signoutUser = async () => {
    setError("");
    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  };
  return (
    <>
      {error && <h1>{error}</h1>}
      {currentUser && <strong>{currentUser.email}</strong>}
      <button onClick={signoutUser}>
        Sign out
      </button>
    </>
  );
};

export default Dashboard;

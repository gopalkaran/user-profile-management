import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(data);
  };
  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <h1>Log in</h1>
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
          <input type="submit" value="Login" />
        </div>
      </form>
      <div>
        <Link to="/reset">Forgot password?</Link>
      </div>
      <div>
        <p>Don't have an account?</p>
        <Link to="/signup">Sign up</Link>
      </div>
    </>
  );
};

export default Login;

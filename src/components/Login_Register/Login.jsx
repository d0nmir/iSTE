import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import "./LoginRegister.css"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userLog = await signInWithEmailAndPassword(auth, email, password);
      const user = userLog.user;

      if (!user.emailVerified) {
        setError("Please confirm your email before logging in!");
        return;
      }

      console.log("Success");
      navigate("/todo");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password!");
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="loginR_">
        <div className="login_register_wrapper">
            <h1 className="login_title">iSTE</h1>
            <h2 className="login_description">USE YOUR TO-DO ACCOUNT</h2>
            <form
            autoComplete="on"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            >
            {/*<button className="button_google">Continue with google</button>*/}
            <input
              type="email"
              name="email"
              placeholder="Enter your email address."
              autoComplete="email"
              className="input_"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password."
              className="input_"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="default_button" type="submit">Sign in</button>
            </form>
            <div className="link_">
                <span>New to To-Do? </span><Link to="/register">Create an account</Link>
            </div>
        </div>
    </div>
  );
}

export default Login;

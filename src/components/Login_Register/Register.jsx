import React, { useState } from 'react';
import { userCollections } from './userCollections';
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password not the same!");
      return;
    }
    if (nickname.trim() === "") {
      alert("Enter your nickname!");
      return;
    }

    try {
      await userCollections(email, password, nickname, navigate);
    } catch (err) {
      console.error("Problem with registration: " + err.message);
    }
  };

  return (
    <div className='loginR_'>
        <div className="login_register_wrapper">
            <form
                onSubmit={handleRegister}
                autoComplete="on"
            >
            <h1 className="login_title">iSTE</h1>
            <h2 className="login_description">CREATE YOUR TO-DO ACCOUNT</h2>  
            <input
              name="email"
              type="email"
              placeholder="Enter your email address."
              autoComplete="email"
              value={email}
              className="input_"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              className="input_"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password."
              value={confirmPassword}
              className="input_"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <input
              name="nickname"
              type="text"
              placeholder="Enter your nickname."
              autoComplete="nickname"
              value={nickname}
              className="input_"
              onChange={(e) => setNickname(e.target.value)}
              required
            />

            <button className="default_button" type="submit">Create</button>
            <div className='link_'>
              <span>Already have an account? </span><Link to="/login">Sign in</Link>
              </div>  

            </form>
        </div>
    </div>
    
    
  );
}

import { Link } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./headFoot.css";

function Header() {
    const [initial, setInitial] = useState("U");
    const [nickname, setNickname] = useState("");
    const [streak, setStreak] = useState(0);
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate("/login"); 
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.nickname) {
                  setNickname(data.nickname);
                  setInitial(data.nickname.charAt(0).toUpperCase());
                  return;
                }
              }

              if (user.displayName) {
                setInitial(user.displayName.charAt(0).toUpperCase());
                setNickname(user.displayName);
              } else if (user.email) {
                setInitial(user.email.charAt(0).toUpperCase());
                setNickname(user.email.split("@")[0]);
              }
            } catch (err) {
              console.error(err);
            }
          }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem("lastVisit");
        let currentStreak = parseInt(localStorage.getItem("dailyStreak") || "0");

        if (lastVisit === today) {
            setStreak(currentStreak);
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastVisit === yesterday.toDateString()) {
                currentStreak += 1;
            } else {
                currentStreak = 1;
            }

            localStorage.setItem("dailyStreak", currentStreak);
            localStorage.setItem("lastVisit", today);
            setStreak(currentStreak);
        }
    }, []);

    return (
        <div className='header'>
            <div className="container">
                <div className='header_objects'>
                    <h2 className='logo'> <span>i</span><span>S</span><span>T</span><span>E</span></h2>

                    <ul className='header_links'>
                        <li><Link className="header_link" to="/todo">To-Do</Link></li>
                        <li><Link className="header_link" to="/achieve">Achievments</Link></li>
                        <li><Link className="header_link" to="/guide">Guide</Link></li>
                        <li><Link className="header_link" to="/about-us">About us</Link></li>
                    </ul>
                    
                    <div className='buttons_wrapper'> 
                        <span className="daily_streak" title="Your daily streak">{streak}</span>
                        <button className="log_out_button" onClick={handleLogout}>Log out</button>
                        <button className="user_" title={nickname}>{initial}</button>
                    </div>                    
                </div>
            </div>
        </div>
    );
}

export default Header;

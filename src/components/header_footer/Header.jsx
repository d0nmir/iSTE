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
    const [dark, setDark] = useState(false);

    const toggleTheme = () => {
      setDark(!dark);
      document.documentElement.classList.toggle("dark");
    };

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
                        <button className='dark_mode' onClick={toggleTheme}>{dark? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 21C9.5 21 7.375 20.125 5.625 18.375C3.875 16.625 3 14.5 3 12C3 9.5 3.875 7.375 5.625 5.625C7.375 3.875 9.5 3 12 3C12.2333 3 12.4625 3.00833 12.6875 3.025C12.9125 3.04167 13.1333 3.06667 13.35 3.1C12.6667 3.58333 12.1208 4.2125 11.7125 4.9875C11.3042 5.7625 11.1 6.6 11.1 7.5C11.1 9 11.625 10.275 12.675 11.325C13.725 12.375 15 12.9 16.5 12.9C17.4167 12.9 18.2583 12.6958 19.025 12.2875C19.7917 11.8792 20.4167 11.3333 20.9 10.65C20.9333 10.8667 20.9583 11.0875 20.975 11.3125C20.9917 11.5375 21 11.7667 21 12C21 14.5 20.125 16.625 18.375 18.375C16.625 20.125 14.5 21 12 21ZM12 19C13.4667 19 14.7833 18.5958 15.95 17.7875C17.1167 16.9792 17.9667 15.925 18.5 14.625C18.1667 14.7083 17.8333 14.775 17.5 14.825C17.1667 14.875 16.8333 14.9 16.5 14.9C14.45 14.9 12.7042 14.1792 11.2625 12.7375C9.82083 11.2958 9.1 9.55 9.1 7.5C9.1 7.16667 9.125 6.83333 9.175 6.5C9.225 6.16667 9.29167 5.83333 9.375 5.5C8.075 6.03333 7.02083 6.88333 6.2125 8.05C5.40417 9.21667 5 10.5333 5 12C5 13.9333 5.68333 15.5833 7.05 16.95C8.41667 18.3167 10.0667 19 12 19Z" fill="white"/>
</svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 21C9.5 21 7.375 20.125 5.625 18.375C3.875 16.625 3 14.5 3 12C3 9.5 3.875 7.375 5.625 5.625C7.375 3.875 9.5 3 12 3C12.2333 3 12.4625 3.00833 12.6875 3.025C12.9125 3.04167 13.1333 3.06667 13.35 3.1C12.6667 3.58333 12.1208 4.2125 11.7125 4.9875C11.3042 5.7625 11.1 6.6 11.1 7.5C11.1 9 11.625 10.275 12.675 11.325C13.725 12.375 15 12.9 16.5 12.9C17.4167 12.9 18.2583 12.6958 19.025 12.2875C19.7917 11.8792 20.4167 11.3333 20.9 10.65C20.9333 10.8667 20.9583 11.0875 20.975 11.3125C20.9917 11.5375 21 11.7667 21 12C21 14.5 20.125 16.625 18.375 18.375C16.625 20.125 14.5 21 12 21ZM12 19C13.4667 19 14.7833 18.5958 15.95 17.7875C17.1167 16.9792 17.9667 15.925 18.5 14.625C18.1667 14.7083 17.8333 14.775 17.5 14.825C17.1667 14.875 16.8333 14.9 16.5 14.9C14.45 14.9 12.7042 14.1792 11.2625 12.7375C9.82083 11.2958 9.1 9.55 9.1 7.5C9.1 7.16667 9.125 6.83333 9.175 6.5C9.225 6.16667 9.29167 5.83333 9.375 5.5C8.075 6.03333 7.02083 6.88333 6.2125 8.05C5.40417 9.21667 5 10.5333 5 12C5 13.9333 5.68333 15.5833 7.05 16.95C8.41667 18.3167 10.0667 19 12 19Z" fill="black"/>
</svg>}</button>
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

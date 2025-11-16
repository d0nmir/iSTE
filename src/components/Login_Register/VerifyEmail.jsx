import React, { useEffect } from "react";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, reload } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await reload(user); 
                if (user.emailVerified) {
                    navigate("/todo"); 
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleCheckVerification = async () => {
        if (auth.currentUser) {
            await reload(auth.currentUser);
            if (auth.currentUser.emailVerified) {
                navigate("/todo");
            } else {
                alert("You haven't confirmed your email yet!");
            }
        }
    };

    return (
        <div className="loginR_">
            <div className="verify_wrapper">
                <h2 className="verify_desc">Confirm your email</h2>
                <p className="verify_text">We've sent an email to your address. Confirm it, then click the button below.</p>
                <button className="verify_button" onClick={handleCheckVerification}>I confirmed</button>        
            </div> 
        </div>
    );
}

export default VerifyEmail;

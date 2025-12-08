import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../config/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

import firstGroupGif from "../../assets/icons/first_group.gif";
import firstTodoGif from "../../assets/icons/first_todo.gif";
import guideGif from "../../assets/icons/guide.gif";
import deleteGroupGif from "../../assets/icons/delete_group.gif";

import "./tilt.js";
import "./achievement.css";

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const userId = user?.uid;

  const gifMap = {
    first_group_created: firstGroupGif,
    first_todo_done: firstTodoGif,
    guide_read: guideGif,
    delete_group_done: deleteGroupGif,
  };

  const refs = useRef({});
  const bellRef = useRef(new Audio("/path/to/sound.mp3"));

  useEffect(() => {
    if (!userId) return;

    const ref = collection(db, "users", userId, "achievements");

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAchievements(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading achievements:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    achievements.forEach((ach) => {
      const el = refs.current[ach.id];
      if (el && ach.unlocked) {
        window.VanillaTilt.init(el, {
          max: 25,
          scale: 1.1,
          speed: 400,
          glare: true,
          "max-glare": 0.5,
        });
      }
    });
  }, [achievements]);

  useEffect(() => {
    achievements.forEach(async (ach) => {
      if (ach.unlocked && !ach.notified) {
        toast.success(<div className="toast-content">
            <img src={gifMap[ach.id]} alt={ach.title} className="toast-gif" />
            <span>{ach.title}</span>
          </div>,
          {
            className: "custom-toast",
            bodyClassName: "custom-toast-body",
            autoClose: 5000,
          });

        if (bellRef.current) {
          bellRef.current.currentTime = 0;
          bellRef.current.play().catch(() => {});
        }

        try {
          const achRef = doc(db, "users", userId, "achievements", ach.id);
          await updateDoc(achRef, { notified: true });
        } catch (error) {
          console.error("Error updating notified:", error);
        }
      }
    });
  }, [achievements, userId]);

  if (loading) return null;

  return (
    <div className="achievement">
      <div className="container">
        <h1 className="achievement_title">Achievements</h1>
        <div className="achievements_container">
          {achievements.map((ach) => (
            <div key={ach.id}>
              <div className="achievement_wrapper">
                {ach.unlocked ? (
                  <img
                    ref={(el) => (refs.current[ach.id] = el)}
                    className="achievement_image"
                    src={gifMap[ach.id]}
                    alt={ach.title}
                  />
                ) : (
                  <div className="locked_achievement">
                    <p className="state">LOCKED</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Achievements;

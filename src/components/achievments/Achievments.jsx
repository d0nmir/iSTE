import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

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


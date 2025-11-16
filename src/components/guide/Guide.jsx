import React from "react";
import { db, auth } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import "./guide.css";

const weeklyRoutines = [
  {
    category: "Work",
    person: "Elon Musk",
    keyToSuccess: "Work hard and think big",
    routine: {
      Monday: ["Check emails", "Focus on SpaceX project", "Meetings"],
      Tuesday: ["Tesla project work", "Emails", "Planning"],
      Wednesday: ["Focus work on SpaceX", "Team meetings", "Innovation"],
      Thursday: ["Tesla & SpaceX projects", "Review progress"],
      Friday: ["Project updates", "Strategy planning"],
      Saturday: ["Emails", "Personal projects"],
      Sunday: ["Rest and reflection"],
    },
  },
  {
    category: "Fitness",
    person: "Eldos Smetov",
    keyToSuccess: "Discipline, training consistency, and mental focus",
    routine: {
      Monday: ["Morning judo training", "Strength training", "Recovery exercises"],
      Tuesday: ["Technique practice", "Sparring sessions", "Cardio"],
      Wednesday: ["Flexibility and mobility training", "Video analysis of matches"],
      Thursday: ["Morning judo training", "Tactical drills", "Core workout"],
      Friday: ["Sparring sessions", "Strength training", "Recovery"],
      Saturday: ["Competition simulation", "Endurance training"],
      Sunday: ["Rest, mental preparation, and visualization"],
    },
  },
  {
    category: "Learning",
    person: "Bill Gates",
    keyToSuccess: "Curiosity and lifelong learning",
    routine: {
      Monday: ["Read books", "Research tech trends"],
      Tuesday: ["Study AI innovations", "Meetings"],
      Wednesday: ["Read articles", "Plan projects"],
      Thursday: ["Explore new software", "Read papers"],
      Friday: ["Learning review", "Strategy planning"],
      Saturday: ["Personal study", "Reflection"],
      Sunday: ["Relax and think creatively"],
    },
  },
  {
    category: "Creative Work",
    person: "Kairat Nurtas",
    keyToSuccess: "Discipline and passion",
    routine: {
      Monday: ["Morning vocal exercises", "Songwriting", "Studio recording"],
      Tuesday: ["Meeting with producers", "Rehearsal", "Exercise"],
      Wednesday: ["Content creation for social media", "Song arrangement"],
      Thursday: ["Concert preparation", "Vocal practice"],
      Friday: ["Studio recording", "Team meetings"],
      Saturday: ["Live performance", "Fan engagement"],
      Sunday: ["Rest, reflection, planning next week"],
    },
  },
];


async function unlockGuideAchievement() {
  const user = auth.currentUser;
  if (!user) return;

  const achRef = doc(db, "users", user.uid, "achievements", "guide_read");

  try {
    await updateDoc(achRef, {
      unlocked: true,
      dateUnlocked: new Date().toISOString(),
    });
    console.log("Achievement unlocked: guide_read");
  } catch (err) {
    console.error("Error unlocking guide achievement:", err);
  }
}

export default function Guide() {
  return (
    <div className="guide-container">
      <h1>GUIDES</h1>
      {weeklyRoutines.map((item, index) => (
        <div
          key={index}
          className="guide-category"
          onClick={unlockGuideAchievement} 
          style={{ cursor: "pointer" }}
        >
          <h2>{item.category}</h2>
          <p>
            <strong>{item.person}</strong> – Key to Success: {item.keyToSuccess}
          </p>
          <div className="weekly-routine">
            {Object.entries(item.routine).map(([day, tasks]) => (
              <div key={day} className="routine-day">
                <h4>{day}</h4>
                <div className="routine-tasks">
                  {tasks.map((task, i) => (
                    <div key={i}>• {task}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

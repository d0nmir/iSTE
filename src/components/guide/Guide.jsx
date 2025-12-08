import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "../../config/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import "./guide.css";
import { ToastContainer, toast } from "react-toastify";
import starIcon from "../../assets/icons/star.png";
import achieve from '../../assets/sound/achieve.mp3'
import ilonImg from "../../assets/icons/ilon.jpg";

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

export default function Guide() {
  const bellRef = useRef(null);
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    bellRef.current = new Audio(
      achieve
    );
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const achRef = doc(db, "users", user.uid, "achievements", "guide_read");
    const unsubscribe = onSnapshot(achRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.unlocked && !data.notified) {
          setAchievement({ id: "guide_read", title: "Guide read!" });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!achievement) return;

    toast.success(
      <div className="toast-content">
                  <img src={starIcon} className="toast-icon" />
                  <span>{achievement.title}</span>
                </div>,
                { autoClose: 5000, toastClassName: "custom-toast", icon: false, position: "bottom-right"  }
    );

    if (bellRef.current) {
      bellRef.current.currentTime = 0;
      bellRef.current.play().catch(() => {});
    }

    const updateNotified = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const achRef = doc(db, "users", user.uid, "achievements", "guide_read");
        await updateDoc(achRef, { notified: true });
      } catch (err) {
        console.error(err);
      }
    };
    updateNotified();
  }, [achievement]);

  const unlockGuideAchievement = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const achRef = doc(db, "users", user.uid, "achievements", "guide_read");
    try {
      await updateDoc(achRef, {
        unlocked: true,
        dateUnlocked: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error unlocking guide achievement:", err);
    }
  };

  return (
    <div className="guide-container">
      <ToastContainer />
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
      <div className="Ilon_advice">
        <h2 className="advice_title">Elon Musk's Tips on How to Study the Right Way</h2>
        <p className="advice_content">In today's world, talent isn't as important as the right approach to education. We'll tell you what you can learn from the modern genius Elon Musk.</p>
        <img className="advice_img" src={ilonImg} alt="" />
        <h3 className="advice_subtitle">1. Do what you love</h3>
        <p className="advice_content">Since childhood, Musk has adored science books about technology and space. He'd read two or three on a weekend, and by the age of eight, he'd mastered the entire Encyclopedia Britannica. By the age of 10, Elon was already programming and designing rockets. At 12, he created his first computer game, which involved shooting aliens with a laser cannon, and sold it for $500! When you learn something you love, the results speak for themselves.</p>
        <h3 className="advice_subtitle">2. Grow your "tree of knowledge"</h3>
        <p className="advice_content">Several years ago, Elon Musk wrote a post on the American forum Reddit asking anyone to ask him anything. One of the questions was about how to study effectively.

One of the secrets to Elon Musk's success is viewing knowledge as a tree. The base of the tree is the trunk and large branches, followed by foliage and smaller twigs. To learn successfully, Musk believes, you need to start with the trunk and main branches. In other words, to master a subject, it's important to understand its fundamental principles and laws. If you start studying a narrow topic without mastering the big picture, "the leaves won't stick." Don't rush into complex or highly specialized topics. Make sure you've fully grasped the basics.</p>
        <h3 className="advice_subtitle">3. Save time</h3>
        <p className="advice_content">Elon Musk attended the University of Pennsylvania on a scholarship, where he earned two degrees in two years. A bachelor's degree in business in the first year and a degree in physics in the second.

Earning two degrees simultaneously is no easy task. But you can save time while still in school, and you don't even have to take two parallel programs. For students who want to learn faster and more effectively, homeschooling is a great option. This allows students to study at their own pace, and an online school can act as a support system, where students watch video lessons and complete assignments. At Foxford Homeschool, students don't waste time on unnecessary things like commuting to school or organizational matters like roll call. Homeschooling frees up time for hobbies and self-development, and you'll achieve more.</p>
        <h3 className="advice_subtitle">4. Don't limit yourself to one area</h3>
        <p className="advice_content">One of Elon Musk's secrets is that he has achieved success in many fields. Today, Elon Musk is:

the founder, CEO, and chief engineer of the space technology company SpaceX;
the CEO and chief visionary of the electric vehicle company Tesla;
the co-founder of the major electronic payment system PayPal.

And he has no plans to stop there! Always strive to learn new things and broaden your horizons in different fields. This is easy to do in school – study all the basic subjects thoroughly. Students often focus only on their favorite or specialized subjects. But it's better to draw knowledge from a variety of fields – you never know what will come in handy.</p>
        
      </div>
    </div>
  );
}

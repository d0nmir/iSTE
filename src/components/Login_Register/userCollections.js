import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";


export async function userCollections(email, password, nickname, navigate) {
  try {
    const userInf = await createUserWithEmailAndPassword(auth, email, password);
    const user = userInf.user;

    await sendEmailVerification(user);
    alert("Verification email sent!");


    await setDoc(doc(db, "users", user.uid), {
      email,
      nickname,
    });


    await setDoc(doc(db, "users", user.uid, "game_info", "user_card"), {
      exp: 0,
      level: 1,
      coins: 0,
    });


    await setDoc(doc(db, "users", user.uid, "task_group", "default"), {
      task_group_name: "Daily routine",
      completed: false,
    });

    const taskGroupRef = collection(db, "users", user.uid, "task_group", "default", "tasks");
    await addDoc(taskGroupRef, {
      task_name: "Wake up",
      completed: false,
    });

    const achievements = [
      { id: "first_group_created", title: "Create your first group", icon: "/icons/first_group.gif" },
      { id: "first_todo_done", title: "Complete your first task", icon: "/icons/first_todo.gif" },
      { id: "guide_read", title: "Read any guide or advice", icon: "/icons/guide.gif" },
      { id: "delete_group_done", title: "Delete a group of tasks that you have completed", icon: "/icons/delete_group.gif" },
    ];

    await Promise.all(
      achievements.map(ach =>
        setDoc(doc(db, "users", user.uid, "achievements", ach.id), {
          title: ach.title,
          unlocked: false,
          dateUnlocked: null,
          icon: ach.icon,
          notified: false, 
        })
      )
    );

    navigate("/verify-email");
    console.log("success!");
  } catch (err) {
    console.error(err);
  }
}

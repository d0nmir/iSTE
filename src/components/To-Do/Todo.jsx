import React, { useState, useEffect } from "react";
import { db, auth } from "../../config/firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { achievementsConditions } from "../achievments/achievmentCondition";
import { achievementsList } from "../achievments/achievmentsList"; 
import "./To-Do.css";

function Todo() {
  const [taskGroups, setTaskGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newTasks, setNewTasks] = useState({});

  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      const groupRef = collection(db, "users", userId, "task_group");
      const snapshot = await getDocs(groupRef);

      const groupsData = await Promise.all(
        snapshot.docs.map(async (groupDoc) => {
          const tasksRef = collection(
            db,
            "users",
            userId,
            "task_group",
            groupDoc.id,
            "tasks"
          );
          const taskSnap = await getDocs(tasksRef);
          const tasks = taskSnap.docs.map((t) => ({ id: t.id, ...t.data() }));
          return { id: groupDoc.id, ...groupDoc.data(), tasks };
        })
      );

      setTaskGroups(groupsData);
      await checkAchievements(groupsData);
    };

    loadData();
  }, [userId]);

  const checkAchievements = async (groupsData) => {
    if (!userId) return;

    const completedTasks = groupsData.reduce(
      (sum, g) => sum + g.tasks.filter((t) => t.completed).length,
      0
    );

    const userData = {
      task_group_count: groupsData.length,
      completed_tasks: completedTasks,
      read_guide: false, 
    };

    for (let ach of achievementsList) {
      const condition = achievementsConditions[ach.id];
      if (condition && condition(userData)) {
        const achRef = doc(db, "users", userId, "achievements", ach.id);
        await updateDoc(achRef, {
          unlocked: true,
          dateUnlocked: new Date().toISOString(),
        });
      }
    }
  };

  const addGroup = async () => {
    if (!newGroupName.trim()) return alert("Enter group name!");
    const ref = collection(db, "users", userId, "task_group");
    const newDoc = await addDoc(ref, {
      task_group_name: newGroupName,
      completed: false,
    });
    const newGroup = { id: newDoc.id, task_group_name: newGroupName, completed: false, tasks: [] };
    const updatedGroups = [...taskGroups, newGroup];
    setTaskGroups(updatedGroups);
    setNewGroupName("");

    await checkAchievements(updatedGroups);
  };

  const addTask = async (groupId) => {
    const taskText = newTasks[groupId];
    if (!taskText?.trim()) return alert("Enter a task");

    const ref = collection(db, "users", userId, "task_group", groupId, "tasks");
    const newDoc = await addDoc(ref, {
      task_name: taskText,
      completed: false,
    });

    const updatedGroups = taskGroups.map((group) =>
      group.id === groupId
        ? { ...group, tasks: [...group.tasks, { id: newDoc.id, task_name: taskText, completed: false }] }
        : group
    );
    setTaskGroups(updatedGroups);
    setNewTasks({ ...newTasks, [groupId]: "" });

    await checkAchievements(updatedGroups);
  };

  const deleteTask = async (groupId, taskId) => {
    const ref = doc(db, "users", userId, "task_group", groupId, "tasks", taskId);
    await deleteDoc(ref);

    const updatedGroups = taskGroups.map((group) =>
      group.id === groupId
        ? { ...group, tasks: group.tasks.filter((t) => t.id !== taskId) }
        : group
    );
    setTaskGroups(updatedGroups);

    await checkAchievements(updatedGroups);
  };

  const deleteGroup = async (groupId) => {
  if (!confirm("Delete group with all tasks?")) return;

  const group = taskGroups.find((g) => g.id === groupId);

  const allTasksCompleted = group?.tasks?.length > 0 && group.tasks.every((t) => t.completed);

  const tasksRef = collection(db, "users", userId, "task_group", groupId, "tasks");
  const snapshot = await getDocs(tasksRef);
  await Promise.all(
    snapshot.docs.map((t) =>
      deleteDoc(doc(db, "users", userId, "task_group", groupId, "tasks", t.id))
    )
  );

  await deleteDoc(doc(db, "users", userId, "task_group", groupId));

  const updatedGroups = taskGroups.filter((g) => g.id !== groupId);
  setTaskGroups(updatedGroups);

  if (allTasksCompleted) {
    const achRef = doc(db, "users", userId, "achievements", "delete_group_done");
    await updateDoc(achRef, {
      unlocked: true,
      dateUnlocked: new Date().toISOString(),
    });
  }

  await checkAchievements(updatedGroups);
};


  const toggleTask = async (groupId, taskId, current) => {
    const ref = doc(db, "users", userId, "task_group", groupId, "tasks", taskId);
    await updateDoc(ref, { completed: !current });

    const updatedGroups = taskGroups.map((group) =>
      group.id === groupId
        ? { ...group, tasks: group.tasks.map((t) => t.id === taskId ? { ...t, completed: !current } : t) }
        : group
    );
    setTaskGroups(updatedGroups);

    await checkAchievements(updatedGroups);
  };

  return (
    <div className="container">
      <div>
        <input
          type="text"
          placeholder="Enter group name..."
          value={newGroupName}
          className="group_input"
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addGroup(); }}
        />
      </div>

      <div className="groups">
        {taskGroups.map((group) => (
          <div key={group.id} className="group_wrapper">
            <div className="group_desc">
              <h2 className="group_name">{group.task_group_name}</h2>
              <button className="delete_button" onClick={() => deleteGroup(group.id)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_192_35)">
                <path d="M1.75 3.50008H2.91667M2.91667 3.50008H12.25M2.91667 3.50008L2.91667 11.6667C2.91667 11.9762 3.03958 12.2729 3.25838 12.4917C3.47717 12.7105 3.77391 12.8334 4.08333 12.8334H9.91667C10.2261 12.8334 10.5228 12.7105 10.7416 12.4917C10.9604 12.2729 11.0833 11.9762 11.0833 11.6667V3.50008M4.66667 3.50008V2.33341C4.66667 2.024 4.78958 1.72725 5.00838 1.50846C5.22717 1.28966 5.52391 1.16675 5.83333 1.16675H8.16667C8.47609 1.16675 8.77283 1.28966 8.99162 1.50846C9.21042 1.72725 9.33333 2.024 9.33333 2.33341V3.50008M5.83333 6.41675V9.91675M8.16667 6.41675V9.91675" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                <clipPath id="clip0_192_35">
                <rect width="14" height="14" fill="white"/>
                </clipPath>
                </defs>
                </svg>
              </button>
            </div>

            {group.tasks.length === 0 ? (
              <p className="task_state">No tasks</p>
            ) : (
              group.tasks.map((task) => (
                <div key={task.id} className="task_wrapper">
                  <input
                    type="checkbox"
                    className="task_check"
                    checked={task.completed}
                    onChange={() => toggleTask(group.id, task.id, task.completed)}
                  />
                  <span className="task_name">{task.task_name}</span>
                  <button className="task_delete_button" onClick={() => deleteTask(group.id, task.id)}>delete</button>
                </div>
              ))
            )}

            <div>
              <input
                className="task_input"
                type="text"
                placeholder="Enter the task name..."
                value={newTasks[group.id] || ""}
                onChange={(e) => setNewTasks({ ...newTasks, [group.id]: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter") addTask(group.id); }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todo;

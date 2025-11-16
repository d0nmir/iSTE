export const achievementsConditions = {
  first_group_created: (userData) => (userData?.task_group_count || 0) >= 1,
  first_todo_done: (userData) => (userData?.completed_tasks || 0) >= 1,
  guide_read: (userData) => userData?.read_guide === true,
  delete_group_done: (userData) => (userData?.deleted_groups || 0) >= 1,
};

// This is your API URL.
const API_URL = 'http://localhost:8083/api/tasks';

/**
 * Handles the complete task deletion logic.
 * @param {string} taskId - The ID of the task to delete.
 * @param {function} setTasks - The React state setter function for the tasks list.
 * @param {function} setIsDeleting - The React state setter for the "deleting" message.
 * @param {function} setError - The React state setter for errors.
 */
export const handleDelete = async (taskId, setTasks, setIsDeleting, setError) => {
  
  // 1. Ask for confirmation
  if (!window.confirm('Are you sure you want to delete this task?')) {
    return; // Stop if the user clicks "Cancel"
  }

  // 2. Show "Deleting..." message
  setIsDeleting(true); 
  setError(null);

  try {
    // 3. Call the API to delete the task
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    // 4. Update the task list in your React state (removes it from the UI)
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

    // 5. Show the success message
    alert("Task deleted successfully!");

  } catch (err) {
    // 6. Show an error message if something went wrong
    setError(err.message);
  } finally {
    // 7. Hide "Deleting..." message
    setIsDeleting(false); 
  }
};
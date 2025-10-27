import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleDelete } from './DeleteTask.js'; // Assuming this is in './DeleteTask.js'

const API_URL = 'http://localhost:8083/api/tasks'; 

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // <-- 1. ADD NEW STATE
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // --- 2. UPDATE THIS FUNCTION ---
  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const confirmationMessage = `Are you sure you want to mark this task as ${newStatus}?`;

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    setIsUpdatingStatus(true); // <-- Show "Updating..." message
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      const updatedTask = await response.json();
      setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));

      alert(`Task successfully marked as ${newStatus}!`);

    } catch (err) {
      setError(err.message); // Show error
    } finally {
      setIsUpdatingStatus(false); // <-- Hide "Updating..." message
    }
  };
  // --- END OF UPDATED FUNCTION ---

  const handleStartEdit = (task) => {
    navigate(`/edit-task/${task.id}`);
  };

  const onDeleteClick = (taskId) => {
    // Pass all state setters to the imported function
    handleDelete(taskId, setTasks, setIsDeleting, setError);
  };

  if (loading) return <p>Loading tasks...</p>;

  // Check for global loading states
  const isActionInProgress = isDeleting || isUpdatingStatus;

  return (
    <div className="task-list-container">
      
      <Link to="/add-task">
        <button className="btn btn-primary" style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>
          Add New Task
        </button>
      </Link>

      {/* 3. ADD "UPDATING" MESSAGE HERE */}
      {isDeleting && <p style={{color: 'blue', fontWeight: 'bold'}}>Deleting...</p>}
      {isUpdatingStatus && <p style={{color: 'blue', fontWeight: 'bold'}}>Updating status...</p>}
      {error && <p style={{color: 'red', fontWeight: 'bold'}}>Error: {error}</p>}

      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks found. Get organized!</p>
      ) : (
        <table className="task-table" width="100%">
          <thead>
            <tr>
              <th>Task Details</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className={`status-row-${task.status}`}>
                <td style={{width: '40%'}}>
                  <strong style={{fontSize: '1.1rem'}}>{task.title}</strong>
                  <p style={{fontSize: '0.9rem', color: '#555'}}>{task.description}</p>
                </td>
                <td>
                  <span className={`status-badge status-${task.status}`}>
                    {task.status.toUpperCase()}
                  </span>
                </td>
                <td>{task.due_date || 'N/A'}</td>
                
                {/* 4. ADD 'disabled' TO ALL BUTTONS */}
                <td className="task-actions">
                  <button 
                    className={`btn btn-status status-toggle-${task.status === 'completed' ? 'unmark' : 'mark'}`}
                    onClick={() => handleStatusChange(task.id, task.status)}
                    disabled={isActionInProgress}
                  >
                    {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleStartEdit(task)}
                    disabled={isActionInProgress}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete"
                    onClick={() => onDeleteClick(task.id)}
                    disabled={isActionInProgress}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
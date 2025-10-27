import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8083/api/tasks';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      const updatedTask = await response.json();
      setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStartEdit = (task) => {
    navigate(`/edit-task/${task.id}`);
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;

  return (
    <div className="task-list-container">
      
      <Link to="/add-task">
        <button className="btn btn-primary" style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>
          Add New Task
        </button>
      </Link>

      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks found. Get organized!</p>
      ) : (
        // --- START OF TABLE ---
        <table className="task-table" width="100%">
          <thead>
            <tr>
              <th>Task Details</th>
              <th>Status</th>
              <th>Due Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              // Use CSS to style the row based on status
              <tr key={task.id} className={`status-row-${task.status}`}>
                {/* 1. Title and Description Cell */}
                <td style={{width: '40%'}}>
                  <strong style={{fontSize: '1.1rem'}}>{task.title}</strong>
                  <p style={{fontSize: '0.9rem', color: '#555'}}>{task.description}</p>
                </td>
                
                {/* 2. Status Cell */}
                <td>
                  <span className={`status-badge status-${task.status}`}>
                    {task.status.toUpperCase()}
                  </span>
                </td>
                
                {/* 3. Due Date Cell */}
                <td>{task.due_date || 'N/A'}</td>
                
                {/* 4. Actions Cell */}
                <td className="task-actions">
                  <button 
                    className={`btn btn-status status-toggle-${task.status === 'completed' ? 'unmark' : 'mark'}`}
                    onClick={() => handleStatusChange(task.id, task.status)}
                  >
                    {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleStartEdit(task)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        // --- END OF TABLE ---
      )}
    </div>
  );
};

export default TaskList;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Import router hooks

const API_URL = 'http://localhost:8083/api/tasks';

// 2. This is now a full page component
const TaskEdit = () => {
  const { taskId } = useParams(); // 3. Get task ID from the URL
  const navigate = useNavigate(); // 4. Hook to redirect after save

  // 5. Set up all component-level state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');

  const [loading, setLoading] = useState(true); // For initial data fetch
  const [saving, setSaving] = useState(false);  // For submit button
  const [error, setError] = useState(null);

  // 6. Fetch existing task data when the component loads
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/${taskId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch task details');
        return res.json();
      })
      .then(data => {
        // 7. Populate the form state with data from the API
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status);
        setDueDate(data.due_date || '');
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [taskId]); // Re-run this effect if the taskId in the URL changes

  // 8. Handle the form submission (with API PUT call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const updatedTask = {
      title,
      description,
      status,
      due_date: dueDate || null
    };

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(updatedTask)
      });

      if (!response.ok) throw new Error('Failed to save changes');

      // 9. Redirect back to the task list on success
      navigate('/task-list');

    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading task details...</p>;
  }

  // Use the same form structure as your AddTask page for consistency
  return (
    <div className="form-container"> 
      <h3>Edit Task: {title}</h3>
      <form onSubmit={handleSubmit} className="task-form">
        {error && <p style={{color: 'red'}}>Error: {error}</p>}

        <label>Title</label>
        <input 
          type="text" 
          placeholder="Task Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        
        <label>Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>

        <label htmlFor="edit-due-date">Due Date:</label>
        <input 
          type="date" 
          id="edit-due-date"
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
        />
        
        <div className="button-group">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/task-list')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskEdit;
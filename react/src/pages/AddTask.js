import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8083/api/tasks';

const AddTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    setSaving(true);
    setError(null);
    
    try {
      const newTaskData = { 
        title, 
        description, 
        due_date: dueDate || null, 
        status: 'pending' 
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(newTaskData),
      });
      
      if (!response.ok) throw new Error('Failed to create task');

      // On success, go back to the list
      navigate('/task-list'); 
    
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit} className="task-form">
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        <input 
          type="text" 
          placeholder="Task Title (Required)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea
          placeholder="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label htmlFor="due-date">Due Date:</label>
        <input 
          type="date" 
          id="due-date"
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
        />
        <div className="button-group">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Add Task'}
          </button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/task-list')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
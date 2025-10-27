// File: ./react-src/src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import your page components
import TaskList from './pages/TaskList';
import AddTask from './pages/AddTask';
import TaskEdit from './pages/UpdateTask'; // <-- 1. Import TaskEdit

function App() {
  return (
    <div className="app-container">
      <h1>Task Management System</h1>
      
      <Routes>
     
        <Route path="/" element={<Navigate to="/task-list" replace />} />
        
        <Route path="/task-list" element={<TaskList />} />
        <Route path="/add-task" element={<AddTask />} />
        
       
        <Route path="/edit-task/:taskId" element={<TaskEdit />} />
      </Routes>
    </div>
  );
}

export default App;
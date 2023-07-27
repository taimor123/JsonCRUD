import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === '') {
      alert('Task text cannot be empty');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/tasks', {
        text: newTask,
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTask = async (taskId, newText) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, { text: newText });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="text"
              value={task.text}
              onChange={(e) => handleUpdateTask(task.id, e.target.value)}
              onBlur={() => handleUpdateTask(task.id, task.text)}
            />
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

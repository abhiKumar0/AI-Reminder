import React from 'react'
import Navbar from '../components/Navbar'
import { Add, AiChat, List } from '../components';

const Home = (props) => {
  const { tab } = props;
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
console.log(tasks)
  const handleAi = (result) => {
    if (result.action === 'add' && result.task) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      const newTask = {
        id: Date.now(),
        task: result.title,
        deadline: result.deadline ? new Date(result.deadline).toLocaleDateString() : '',
        importance: result.importance || 'medium',
        completed: false,
      };
      
      console.log("New task being added:", newTask);
      tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      alert('Task added via AI!');
    }
  };
  

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8">
        {
          tab === "add" ?
          <>
            <Add />
            <List />
          </>
          : 
          <>
          <AiChat handleAdd={handleAi} />
          </>
        } 
        
      </main>
    </div>
  )
}

export default Home
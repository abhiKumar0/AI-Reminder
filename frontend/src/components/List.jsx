import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

const List = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet. Add some tasks to get started!</p>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task.id)}
                  />
                  <div>
                    <p className={`font-medium ${task.completed ? "line-through" : ""}`}>
                      {task.title}
                    </p>
                    {/* {task.date && ( */}
                      <p className="text-sm text-gray-500">
                        Due: {task?.deadline || task?.date}
                      </p>
                    {/* )} */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getImportanceColor(task.importance)}>
                    {task.importance}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
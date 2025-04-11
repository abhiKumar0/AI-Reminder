import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const Add = () => {
  const [task, setTask] = useState("");
  const [date, setDate] = useState();
  const [importance, setImportance] = useState("medium");
  const handleSave = () => {
    if (!task) return;
      // console.log(typeof(date))
      // console.log(date)
    
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const newTask = {
      id: Date.now(),
      title: task,
      deadline: date ? format(date, "PPP") : "",
      importance,
      completed: false
    };
    
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    // Reset form
    setTask("");
    setDate();
    setImportance("medium");
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-bold">Add New Reminder</h2>
      
      <div className="space-y-4">
        <div>
          <Label className='mb-1' htmlFor="task">Reminder</Label>
          <Input
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task"
          />
        </div>

        <div>
          <Label className='mb-2'>Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a deadline date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className='mb-1'>Importance</Label>
          <RadioGroup
            value={importance}
            onValueChange={setImportance}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="text-green-600">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-yellow-600">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="text-red-600">High</Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={!task}
        >
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default Add;
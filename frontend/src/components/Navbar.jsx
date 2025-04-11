import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const Navbar = (props) => {
  const { setTab } = props;


  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">AI ChatBot</div>
          <Tabs defaultValue="add" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger onClick={() => setTab("add")} value="add">Add</TabsTrigger>
              <TabsTrigger onClick={() => setTab("ask")} value="ask">Ask AI</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
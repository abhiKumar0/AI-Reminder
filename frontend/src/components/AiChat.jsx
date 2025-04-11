import React, { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import axios from 'axios'
import { content } from '../utils/constant'

const AiChat = ({handleAdd}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'google/gemini-2.5-pro-exp-03-25:free',
          messages: [
            {
              role: 'system',
              content,
            },
            {
              role: 'user',
              content: input,
            },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Reminder AI App',
          },
        }
      );

      console.log("AI Response:", response.data.choices[0].message.content);
      const aiReply = response.data.choices[0].message.content;
      
      // Try to extract and parse the JSON more carefully
      const match = aiReply.match(/\{[\s\S]*\}/);
      
      if (!match) {
        console.error("No valid JSON found in AI reply");
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I couldn't process that request properly. Please try again." 
        }]);
        return;
      }

      try {
        const json = JSON.parse(match[0]);
        console.log("Parsed JSON:", json);  // Debug log
        
        // Only add the task if it's an 'add' action
        if (json.action === 'add' && json.task) {
          handleAdd(json);
          
          // Create a formatted response string
          const formattedResponse = `✅ Added new task:\n"${json.task.title}"\nDue: ${new Date(json.task.deadline).toLocaleDateString()}\nPriority: ${json.task.importance}`;
          
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: formattedResponse 
          }]);
        } else {
          // Handle other types of responses
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I understood your request but it wasn't a task addition. Please try adding a task." 
          }]);
        }
      } catch (error) {
        console.error("JSON parsing failed:", error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "There was an error processing your request. Please try again." 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, there was an error communicating with the AI. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    console.log(message)
    return (
      <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-gray-600'
        }`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
        </div>
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
            isUser 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message?.content}</p>
          </div>
          <span className="text-xs text-gray-400 mt-1">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Assistant
        </h2>
      </div>

      {/* Messages Container */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Start a conversation with the AI assistant
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              AI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/50 p-6">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 py-6 text-base"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-12 w-12"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AiChat;
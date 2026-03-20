import React, { useState } from 'react';
import '../../styles/apps.css';

export default function AIAgentApp() {
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Hello! I am Ankit\'s AI representative. You can ask me questions about his projects, skills, or experience.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Mock AI response for now (to be wired to backend RAG)
    setTimeout(() => {
      setMessages([...newMessages, { role: 'agent', content: `I'm currently running in UI mock mode. Soon I will connect to the backend RAG pipeline to answer: "${input}"` }]);
    }, 800);
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-wrapper">
        <input 
          type="text" 
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
        />
        <button className="chat-btn" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

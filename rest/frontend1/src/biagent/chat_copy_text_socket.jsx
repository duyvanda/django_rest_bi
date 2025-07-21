// frontend/src/App.js
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const pingIntervalRef = useRef(null); // To store the interval ID

  useEffect(() => {
    // Establish WebSocket connection
    // *** CHANGE THIS LINE ***
    ws.current = new WebSocket('wss://birest-6ey4kecoka-as.a.run.app/ws/echo/');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      setMessages(prev => [...prev, 'Connected to WebSocket!']);

      // Start sending pings every 25 seconds
      pingIntervalRef.current = setInterval(() => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ message: 'ping' }));
          console.log('Sent ping.');
        }
      }, 10000); // Send ping every 25 seconds

    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data.message]);
      
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      setMessages(prev => [...prev, 'WebSocket Disconnected.']);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, `WebSocket Error: ${error.message}`]);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ message: messageInput }));
      setMessageInput(''); // Clear the input after sending
    } else {
      console.warn('WebSocket is not open.');
      setMessages(prev => [...prev, 'Error: WebSocket is not open.']);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Django Channels + React Echo App</h1>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={sendMessage} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          Send Message
        </button>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px', backgroundColor: '#f9f9f9' }}>
        <h2>Messages:</h2>
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: '5px 0' }}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
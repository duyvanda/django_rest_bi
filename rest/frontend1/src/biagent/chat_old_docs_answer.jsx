/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
// import { fetchMessages, sendMessage } from "./api";
import ReactMarkdown from "react-markdown";

import {
    Button,
    // ButtonGroup,
    // Col,
    // Row,
    // Container,
    // Form,
    // Spinner,
    // Card,
    // ListGroup,
    // Modal,
    // FloatingLabel,
    // Table,
    // Stack,
    // Dropdown
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

const Chat = () => {
    const navigate = useNavigate();
    const [manv, set_manv] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { sender: "bot", content: "Gemini 2.0 Hello! Hãy đặt câu hỏi cho tôi !" },
    ]);
    const [content, setContent] = useState("");
    const chatEndRef = useRef(null);

    // const [isHovered, setIsHovered] = useState(false);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        // const media = window.matchMedia('(max-width: 960px)');
        // const isMB = (media.matches);
        // const dv_width = window.innerWidth;
        // userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'thi_cmsp_tp', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        // fetch_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        
        // if JSON.parse(localStorage.getItem("userInfo")).manv

        } else {
            navigate('/login?redirect=/biagent');
        };

    }, []);


    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 200); // Đợi 100ms để tin nhắn mới render xong rồi mới cuộn
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim()) return; // Prevent empty messages
        console.log("handleSend");
        // Append user message to the list
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "user", content: message },
        ]);
        scrollToBottom()
    
        try {
          const response = await fetch(`https://bi.meraplion.com/local/doc_answer/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"quesion": message, "manv": manv}),
          });
    
          if (!response.ok) {
            throw new Error("Failed to send message");
          }
    
          const data = await response.json();

          console.log("answer: ",data)
          
    
          // Append bot response to the list
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", content: data.answer }, // Assuming server returns { reply: "Response text" }
          ]);
        } catch (error) {
          console.error("Error:", error);
        }
    
        setMessage(""); // Clear input field
      };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.chatbox}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.message,
                                ...(msg.sender === "user" ? styles.userMessage : styles.botMessage),
                            }}
                        >
                            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    ))}
                    <div ref={chatEndRef} /> {/* Auto-scroll anchor */}
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Hỏi tôi..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={styles.input}
                    />
                    <Button variant="light" onClick={handleSend}>Gửi</Button>

                    {/* <button
                    onClick={scrollToBottom}
                    style={{
                    ...styles.scrollButton,
                    backgroundColor: isHovered ? "#555" : "#444", // Darker on hover
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    >
                    ⬆️
                    </button> */}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: "90%", // Responsive width
        maxWidth: "900px", // Wider on desktops
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#00A79D",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        fontSize: "1.5rem",
        marginBottom: "10px",
    },
    chatbox: {
        height: "500px", // More height for desktop
        overflowY: "auto",
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "10px",
        backgroundColor: "white",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
    },
    message: {
        padding: "12px",
        marginBottom: "8px",
        borderRadius: "10px",
        maxWidth: "75%",
        wordWrap: "break-word",
        fontSize: "1.0rem",
    },
    userMessage: {
        background: "#d1e7dd",
        alignSelf: "flex-end",
        textAlign: "right",
    },
    botMessage: {
        background: "#f8d7da",
        alignSelf: "flex-start",
        textAlign: "left",
    },
    inputContainer: {
        display: "flex",
        gap: "10px",
    },
    input: {
        flex: 1,
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "1.1rem",
    },
    button: {
        padding: "12px",
        border: "none",
        background: "#007bff",
        color: "white",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "1.1rem",
    },
    scrollButton: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        color: "white",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
        transition: "background 0.3s ease-in-out",
    },
};

// Responsive styles for mobile and tablets
const responsiveStyles = `
@media (max-width: 1024px) {
    .container { max-width: 700px; } /* Tablets */
}
@media (max-width: 768px) {
    .container { width: 100%; max-width: 100%; } /* Mobile full width */
    .chatbox { height: 95vh; } /* Adjust height for smaller screens */
}
`;

// Inject responsive styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = responsiveStyles;
document.head.appendChild(styleSheet);

export default Chat;



// const responsiveStyles = `
// @media (max-width: 1024px) {
//     .container { max-width: 700px; } /* Tablets */
// }
// @media (max-width: 768px) {
//     .container { width: 100%; max-width: 100%; } /* Mobile full width */
//     .chatbox { height: 400px; } /* Adjust height for smaller screens */
// }
// `;
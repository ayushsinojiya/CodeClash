// // ... [other imports]
// import { useRef, useState, useEffect } from "react";
// import { Editor } from "@monaco-editor/react";
// import { CODE_SNIPPETS } from "./Constants"; 
// import Output from "./Output";
// import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
// import "./CodeEditor.css";
// import "./LanguageSelector.css";

// // Initialize socket connection
// const socket = io("http://localhost:5000");

// // Language versions for the dropdown
// const LANGUAGE_VERSIONS = {
//   javascript: "18.15.0",
//   typescript: "5.0.3",
//   python: "3.10.0",
//   java: "15.0.2",
//   csharp: "6.12.0",
//   php: "8.2.3",
//   cpp: "14.0.0",
//   c: "11.0.0",
// };

// // LanguageSelector component
// const languages = Object.entries(LANGUAGE_VERSIONS);

// const LanguageSelector = ({ language, onSelect }) => {
//   return (
//     <div className="language-dropdown">
//       <select value={language} onChange={(e) => onSelect(e.target.value)}>
//         {languages.map(([lang, version]) => (
//           <option key={lang} value={lang}>
//             {lang} ({version})
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// const Chatbox = () => {
//   const editorRef = useRef();
//   const navigate = useNavigate();
//   const [value, setValue] = useState(CODE_SNIPPETS["javascript"]);
//   const [language, setLanguage] = useState("javascript");
//   const [output, setOutput] = useState("");
//   const [testResults, setTestResults] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [chatVisible, setChatVisible] = useState(false);
//   const [popupMessage, setPopupMessage] = useState(null); // State for chat popup
//   const [surrenderPopupVisible, setSurrenderPopupVisible] = useState(false); // State for surrender popup

//   const onMount = (editor) => {
//     editorRef.current = editor;
//     editor.focus();
//   };

//   const onSelect = (language) => {
//     setLanguage(language);
//     setValue(CODE_SNIPPETS[language] || "");
//   };

//   // Function to handle surrendering
//   // Function to handle surrendering
// const surrenderGame = () => {
//   // Show confirmation dialog
//   const confirmSurrender = window.confirm("Are you sure you want to surrender?");
  
//   // Proceed only if the user confirms
//   if (confirmSurrender) {
//     socket.emit('surrender');
//     alert("You have surrendered! Redirecting to rank rating page...");
//     navigate('/rank-rating');
//   }
// };


//   // Join room on component mount and listen for events
//   useEffect(() => {
//     console.log("Joining game room...");
//     socket.emit('joinGame');

//     // Listen for room and message events
//     socket.on('secondPlayerJoined', () => {
//       console.log("Second player has joined the room.");
//     });

//     socket.on('receiveMessage', (data) => {
//       console.log("Message received on client:", data.message);
//       if (data.senderId !== socket.id) {
//         setMessages((prev) => [...prev, { text: data.message, senderId: data.senderId }]);
//         setPopupMessage(data.message); // Set chat popup message
//         setTimeout(() => setPopupMessage(null), 3000); // Clear chat popup after 3 seconds
//       }
//     });

//     socket.on('playerSurrendered', () => {
//       setSurrenderPopupVisible(true); // Show surrender popup
//       setTimeout(() => {
//         setSurrenderPopupVisible(false); // Hide surrender popup after 3 seconds
//         navigate('/rank-rating'); // Redirect to the rank rating page
//       }, 3000); // Adjust duration as needed
//     });

//     // Clean up the socket listeners on unmount
//     return () => {
//       socket.off('secondPlayerJoined');
//       socket.off('receiveMessage');
//       socket.off('playerSurrendered'); // Clean up listener for surrender
//     };
//   }, [navigate]);

//   // Send message
//   const sendMessage = () => {
//     if (inputMessage) {
//       console.log("Sending message:", inputMessage);
      
//       // Add the message to the state immediately for the sender
//       setMessages((prev) => [...prev, { text: inputMessage, senderId: socket.id }]);
      
//       // Emit the message to the server
//       socket.emit('sendMessage', inputMessage, socket.id);
//       setInputMessage(''); // Clear input box
//     }
//   };
  

//   const toggleChat = () => {
//     setChatVisible(!chatVisible);
//   };

//   return (
//     <div className="code-editor-container">
//       {/* Header Section */}
//       <div className="header">
//         <div className="action-buttons">
//           <button className="surrender-button" onClick={surrenderGame}>Surrender</button>
//           <button onClick={toggleChat} style={chatButtonStyle}>
//             Chat
//           </button>
//         </div>
//       </div>

//       {/* Right Column: Editor and Output */}
//       <div className="right-column">
//         <div className="row-editor">
//           <div className="question">
//             <p>Problem: Write your code here</p>
//           </div>

//           {/* Code Editor */}
//           <div className="code-editor">
//             <div className="editor-header">
//               <LanguageSelector language={language} onSelect={onSelect} />
//               <p className="code-editor-header">Write your Code Here</p>
//             </div>

//             <Editor
//               options={{ minimap: { enabled: false } }}
//               height="350px"
//               theme="vs-dark"
//               language={language}
//               defaultValue={CODE_SNIPPETS[language]}
//               onMount={onMount}
//               value={value}
//               onChange={(newValue) => setValue(newValue)}
//             />
//           </div>
//         </div>

//         {/* Output Section */}
//         <Output output={output} testResults={testResults} />
//       </div>

//       {/* Chatbox */}
//       {chatVisible && (
//         <div style={chatboxStyle}>
//           <div style={messageListStyle}>
//             {messages.map((msg, index) => (
//               <div key={index} style={msg.senderId === socket.id ? myMessageStyle : otherMessageStyle}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <input
//             type="text"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             style={inputStyle}
//           />
//           <button onClick={sendMessage} style={sendButtonStyle}>Send</button>
//         </div>
//       )}

//       {/* Chat Popup Notification */}
//       {popupMessage && (
//         <div style={popupStyle}>
//           {popupMessage}
//         </div>
//       )}

//       {/* Surrender Popup Notification */}
//       {surrenderPopupVisible && (
//         <div style={surrenderPopupStyle}>
//           Your opponent has surrendered!
//         </div>
//       )}
//     </div>
//   );
// };

// // Styles
// const chatButtonStyle = {
//   position: 'absolute',
//   top: '10px',
//   right: '10px',
//   padding: '10px',
//   backgroundColor: '#007bff',
//   color: 'white',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// };

// const chatboxStyle = {
//   position: 'absolute',
//   top: '50px',
//   right: '10px',
//   width: '300px',
//   height: '400px',
//   border: '1px solid #ccc',
//   backgroundColor: 'white',
//   borderRadius: '5px',
//   boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//   display: 'flex',
//   flexDirection: 'column',
// };

// const messageListStyle = {
//   flexGrow: 1,
//   overflowY: 'auto',
//   padding: '10px',
// };

// const inputStyle = {
//   padding: '10px',
//   border: '1px solid #ccc',
//   borderRadius: '5px',
//   margin: '10px',
// };

// const sendButtonStyle = {
//   padding: '10px',
//   backgroundColor: '#007bff',
//   color: 'white',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// };

// const myMessageStyle = {
//   textAlign: 'right',
//   margin: '5px 0',
//   backgroundColor: '#007bff',
//   color: 'white',
//   padding: '5px',
//   borderRadius: '5px',
// };

// const otherMessageStyle = {
//   textAlign: 'left',
//   margin: '5px 0',
//   backgroundColor: '#f1f1f1',
//   padding: '5px',
//   borderRadius: '5px',
// };

// const popupStyle = {
//   position: 'absolute',
//   bottom: '10px',
//   right: '10px',
//   padding: '10px',
//   backgroundColor: '#007bff',
//   color: 'white',
//   borderRadius: '5px',
//   zIndex: 1000,
// };

// const surrenderPopupStyle = {
//   position: 'absolute',
//   top: '50px',
//   left: '50%',
//   transform: 'translateX(-50%)',
//   padding: '10px',
//   backgroundColor: 'red',
//   color: 'white',
//   borderRadius: '5px',
//   zIndex: 1000,
// };

// export default Chatbox;

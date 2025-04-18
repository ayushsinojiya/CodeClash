// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Adjust the URL as needed

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     // Listen for messages from the server
//     socket.on("receive_message", (message) => {
//       console.log("Received message:", message); // Log received message
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Ensure cleanup on component unmount
//     return () => {
//       socket.off("receive_message");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (input.trim()) {
//       const message = { text: input, sender: socket.id }; // Use socket.id as the sender identifier
//       socket.emit("send_message", message);
//       console.log("Sent message:", message); // Log sent message
//       setMessages((prevMessages) => [...prevMessages, message]);
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-auto p-4 border border-gray-300 rounded-lg">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`my-2 p-2 rounded-lg ${
//               msg.sender === socket.id ? "bg-green-300" : "bg-gray-300"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex mt-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 p-2 border border-gray-300 rounded-lg"
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./button"; 
import { Badge } from "./badge";
import CodeEditor from "./CodeEditor";
import axios from 'axios';

export default function QuestionDetail() {
  const [question, setQuestion] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [timeLeft, setTimeLeft] = useState(0); 
  const [isTimerRunning, setIsTimerRunning] = useState(false); 

  const [messages, setMessages] = useState([]); 
  const [inputMessage, setInputMessage] = useState(""); 

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get('http://localhost:5000/questions'); 
        if (response.data.questions) {
          const foundQuestion = response.data.questions.find(q => q._id === id);
          if (foundQuestion) {
            setQuestion(foundQuestion);
          }
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestion();
  }, [id]);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(3600);
    setIsTimerRunning(true);
  };

  const handleCodeSubmit = () => {
    alert("Code submitted!");
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: inputMessage, senderId: "user" },
      ]);
      setInputMessage(""); 
    }
  };

  if (!question) { 
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 grid grid-cols-3 gap-6 p-6">
        <div className="col-span-1 bg-card rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Current Question</h2>
            {question.difficulty && (
              <Badge variant="secondary" className="text-xs">
                {question.difficulty}
              </Badge>
            )}
          </div>
          <div className="bg-muted rounded-md p-4 text-left">
            <h3 className="text-lg font-semibold mb-4">{question['Question Title']}</h3>
            <h4 className="text-muted-foreground">{question['Question Text']}</h4>
            <p className="text-muted-foreground my-4"><strong>Tags: </strong> {question['Topic Tagged text'] || 'Output not available'}</p>
            <p className="text-muted-foreground my-4"><strong>Input:</strong> {question.Input}</p>
            <p className="text-muted-foreground my-4"><strong>Output:</strong> {question['Expected Output'] || 'Constraints not available'}</p>
          </div>
        </div>

        <div className="col-span-2 bg-card rounded-lg shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Code Editor</h2>
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={() => alert("Surrender feature coming soon")} className="bg-red-500 text-white">
                Surrender
              </Button>
              <div>Time Left: <span className="text-blue-700">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div>
              <Button variant="outline" size="sm" onClick={startTimer}>
                Start Timer
              </Button>
              <Button variant="outline" size="sm" onClick={handleCodeSubmit}>
                Submit Code
              </Button>
            </div>
          </div>
          <CodeEditor language="javascript" value="" onChange={() => {}} />
        </div>

        <div className="col-span-3 bg-card rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Chat</h2>
          <div className="flex-1 overflow-y-auto border border-muted rounded-lg p-4 mb-4">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${msg.senderId === "user" ? "bg-green-200" : "bg-gray-200"}`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 border border-muted rounded-lg p-2 mr-2"
              placeholder="Type your message..."
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Badge } from "./badge";
import { Button } from "./button";
import CodeEditor from "./CodeEditor";
import { useLocation, useNavigate } from "react-router-dom";
import { executeCode } from './api'; // Import the executeCode function
import axios from 'axios'; // For making API calls to fetch questions

const socket = io("http://localhost:5000");

export default function Test() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [popupMessage, setPopupMessage] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [comparisonResult, setComparisonResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [isError, setIsError] = useState(false);
  const [language, setLanguage] = useState('cpp'); // Default language
  const editorRef = useRef(null);
   // Retrieve the question details from the state
   const { questions } = location.state || {}; // Default to an empty object if no state is found
  
   useEffect(() => {
     if (questions) {
       setCurrentQuestion(questions[0]);
       console.log(questions[0]);
       console.log('Questions received on the coding page:', questions);
     } else {
       console.log('No questions received.');
     }
   }, [questions]);  
  const chatBoxRef = useRef(null);

  useEffect(() => {
    socket.emit('joinGame');

    socket.on('bothPlayersReady', ({ questions }) => {
      if (questions.length > 0) {
        setIsActive(true);
        setTimeLeft(1200); // Reset timer to 20 minutes for the first question
      }
    });

    socket.on('receiveMessage', (data) => {
      if (data.senderId !== socket.id) {
        setMessages((prev) => [...prev, { message: data.message, senderId: data.senderId }]);
        setPopupMessage(data.message);
        setTimeout(() => setPopupMessage(null), 3000);
      }
    });

    socket.on('playerSurrendered', (playerId) => {
      alert(`Player ${playerId} has surrendered. You win!`);
      navigate('/rank-rating');
    });

    return () => {
      socket.off('joinGame');
      socket.off('bothPlayersReady');
      socket.off('receiveMessage');
      socket.off('playerSurrendered');
    };
  }, [navigate]);

  const startNewQuestion = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex]);
      setQuestionIndex(nextIndex);
      setTimeLeft(1200); // Reset timer for each new question
      setIsActive(true);
    } else {
      navigate('/rank-rating'); // Redirect after all questions are completed
    }
  };

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      startNewQuestion(); // Automatically proceed to the next question if time runs out
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const sendMessage = () => {
    if (inputMessage) {
      socket.emit('sendMessage', { message: inputMessage, senderId: socket.id });
      setMessages((prev) => [...prev, { message: inputMessage, senderId: socket.id }]);
      setInputMessage('');
    }
  };

  const fetchExpectedOutput = async (questionId) => {
    try {
      const response = await axios.get(`http://localhost:5000/questions/${questionId}/output`);
      if (response.data && response.data.expectedOutput) {
        console.log("Expected Output:", response.data.expectedOutput);
        return response.data.expectedOutput;
      } else {
        console.error("No expected output found for this question.");
        return '';
      }
    } catch (error) {
      console.error("Error fetching expected output:", error);
      return '';
    }
  };

  const normalizeOutput = (output) => {
    if (!output) return ''; // Handle undefined or null output

    return output
        .trim() // Remove leading/trailing whitespace
        .toLowerCase() // Normalize to lowercase
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/[\n\r]+/g, ' ') // Remove newlines
        .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric characters (except spaces)
        .replace(/\b(true|false|yes|no|1|0)\b/g, match => match === 'true' || match === '1' || match === 'yes' ? 'true' : 'false'); // Normalize boolean representations
    };

    const runCode = async () => {
      const sourceCode = editorRef.current.getValue();
      if (!sourceCode) return;
    
      try {
        setIsLoading(true);
    
        // Fetch the expected output for the current question
        const expectedOutput = await fetchExpectedOutput(currentQuestion._id);
    
        // Execute the user's code
        const { run: result } = await executeCode(language, sourceCode);
        setOutput(result.output.split("\n"));
        setIsError(!!result.stderr);
    
        if (expectedOutput) {
          console.log("Expected Output:", expectedOutput);
    
          const userOutput = normalizeOutput(result.output);
          const expected = normalizeOutput(expectedOutput);
    
          // Compare user output with expected output
          if (userOutput === expected) {
            setComparisonResult("Correct! Your output matches the expected output.");
            setTimeout(() => startNewQuestion(), 4000); // Move to next question after a delay
          } else {
            setComparisonResult(`Incorrect! Your output: "${userOutput}" does not match the expected output: "${expected}".`);
          }
        } else {
          console.error("Expected output is undefined.");
          setComparisonResult("Expected output is not available.");
        }
      } catch (error) {
        console.error("Error while running code:", error);
        alert(`An error occurred: ${error.message || "Unable to run code"}`);
      } finally {
        setIsLoading(false);
      }
    };
    
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-screen bg-grey 700">
      <main className="flex-1 grid grid-cols-3 gap-6 p-6">
        <div className="col-span-1 bg-card rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Current Question</h2>
            {currentQuestion && (
              <Badge variant="secondary" className="text-xs">
                {currentQuestion.difficulty}
              </Badge>
            )}
          </div>
          <div className="bg-muted rounded-md p-4 text-left">
            {currentQuestion ? (
              <>
                <h3 className="text-lg font-semibold mb-4">{currentQuestion['Question Title']}</h3>
                <h4 className="text-muted-foreground">{currentQuestion['Question Text']}</h4>
                <p className="text-muted-foreground my-4"><strong>Tags: </strong> {currentQuestion['Topic Tagged text'] || 'Tags not available'}</p>
                <p className="text-muted-foreground my-4"><strong>Input:</strong> {currentQuestion['Input']}</p>
                <p className="text-muted-foreground my-4"><strong>Output:</strong> {currentQuestion['Expected Output'] || 'Output not available'}</p>
              </>
            ) : (
              <p>Loading question...</p> 
            )}
          </div>
        </div>

        <div className="col-span-2 bg-card rounded-lg shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Code Editor</h2>
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={() => navigate('/rank-rating')} className="bg-red-500 text-white">
                Surrender
              </Button>
              <div>Time: <span className="text-blue-700">{formatTime(timeLeft)}</span></div>
              <Button variant="outline" size="sm" onClick={runCode}>
                Submit Code
              </Button>
            </div>
          </div>
          <CodeEditor  
            ref={editorRef} 
            language={language} // Pass current language
            onLanguageChange={setLanguage} // Pass the function to change language
            value={code} onChange={setCode} />
        </div>

        <div className="col-span-3 bg-card rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Chat</h2>
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto border border-muted rounded-lg p-4 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${msg.senderId === socket.id ? "bg-green-200" : "bg-gray-200"}`}
              >
                {msg.message}
              </div>
            ))}
            {popupMessage && (
              <div className="absolute bottom-0 left-0 p-4 bg-black text-white text-xs">
                {popupMessage}
              </div>
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full p-2 border border-muted rounded-l-lg"
              placeholder="Enter your message"
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r-lg">
              Send
            </button>
          </div>
          {comparisonResult && (
            <div className="mt-4 p-4 text-lg">
              <p>{comparisonResult}</p>
            </div>
          )}
          {isLoading && (
            <div className="mt-4 p-4 text-lg">
              <p>Running your code...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

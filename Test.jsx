import { useState, useEffect } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import CodeEditor from "./CodeEditor";

const questions = [
  {
    id: 1,
    title: "Implement a function to reverse a linked list",
    description:
      "Given the head of a singly linked list, reverse the list and return the new head.",
    input: "s = ['h','e','l','l','o']", 
    output: "['o','l','l','e','h']",
    constraint: "1 <= s.length <= 10^5",
    difficulty: "Medium",
  },
];

const comments = [
  {
    id: 1,
    user: { name: "John Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
    text: "Great problem! I used a similar approach with a while loop to reverse the list. One optimization could be to use a recursive solution.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: { name: "Jane Smith", avatar: "/placeholder-user.jpg", initials: "JS" },
    text: "I tried a recursive approach and it worked well. Here's the code:",
    timestamp: "1 day ago",
  },
];

const progressDetails = {
  completed: 24,
  total: 50,
  successRate: 80,
  streak: 7,
};

export default function new() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [socket, setSocket] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://your-server-url"); // Replace with your server URL
    setSocket(newSocket);

    // Listen for player connection updates
    newSocket.on("playerCount", (count) => {
      setPlayerCount(count);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinGame = () => {
    if (socket) {
      socket.emit("joinGame", { name: "PlayerName" }); // Replace "PlayerName" with the actual player's name
      console.log("Player has joined the game.");
    }
  };

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(3600);
    setIsActive(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeSubmit = () => {
    console.log("Submitted Code: ", code);
    setCode(""); 
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 grid grid-cols-3 gap-6 p-6">
        

        {/* Current Question Section */}
        <div className="col-span-1 bg-card rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Current Question</h2>
            <Badge variant="secondary" className="text-xs">
              {questions[0].difficulty}
            </Badge>
          </div>
          <div className=" bg-muted rounded-md p-4 text-left">
            <h3 className="text-lg font-semibold mb-4">{questions[0].title}</h3>
            <h4 className="text-muted-foreground">{questions[0].description}</h4>
            <p className="text-muted-foreground my-4"><strong>Input:</strong> {questions[0].input}</p>
            <p className="text-muted-foreground my-4"><strong>Output:</strong> {questions[0].output}</p>
            <p className="text-muted-foreground my-4"><strong>Constraints:</strong> {questions[0].constraint}</p>
          </div>
        </div>

        {/* CodeEditor and Output Section */}
        <div className="col-span-2 bg-card rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Code Editor</h2>
            <div>Time: <span className="text-blue-700">{formatTime(timeLeft)}</span></div>
            <Button variant="outline" size="sm" onClick={startTimer}>
              Start Timer
            </Button>
            <Button variant="outline" size="sm" onClick={handleCodeSubmit}>
              <PlayIcon className="w-4 h-4 mr-2" />
              Submit Code
            </Button>
          </div>
          <CodeEditor language={language} value={code} onChange={setCode} />
        </div>

        {/* Discussion Section */}
        <div className="col-span-3 bg-card rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Discussion</h2>
            <Button variant="outline" size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={comment.user.avatar} alt="User Avatar" />
                  <AvatarFallback>{comment.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{comment.user.name}</div>
                    <div className="text-xs text-muted-foreground">{comment.timestamp}</div>
                  </div>
                  <p className="text-muted-foreground text-left">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Icons 
function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}


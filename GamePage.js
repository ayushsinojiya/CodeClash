import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const GamePage = () => {
  const [waiting, setWaiting] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Set player ID when connecting to the server
    socket.on('connect', () => {
      setPlayerId(socket.id); // Save the socket ID as the player ID
    });

    // Listen for both players being ready
    socket.on('bothPlayersReady', ({ roomId, questions }) => {
      console.log('Both players are ready. Questions received:', questions);
      setQuestions(questions);
      const questionIds = questions.map(question => question._id).join('&');
      navigate(`/coding`, { state: { questions } });
    });
    
    

    // Listen for queue cancellation
    socket.on('queueCancelled', () => {
      setWaiting(false);
      console.log('You have successfully canceled your queue.');
    });

    // Clean up event listeners on component unmount
    return () => {
      socket.off('connect');
      socket.off('bothPlayersReady');
      socket.off('queueCancelled');
    };
  }, [navigate]);

  const startGame = async () => {
    setWaiting(true);
    socket.emit('joinGame'); // Emit join game event
    console.log('Join game event emitted');

    // Fetch random questions
    const fetchedQuestions = await fetchRandomQuestions();
    
    // Emit the fetched questions to the server to share with the second player
    socket.emit('shareQuestions', fetchedQuestions);
  };

  const fetchRandomQuestions = async () => {
    const response = await fetch('http://localhost:5000/random-questions');
    const data = await response.json();
    return data.questions; // Adjust based on your response structure
  };

  const cancelQueue = () => {
    socket.emit('cancelQueue'); // Emit cancel queue event to the server
    console.log('Cancel queue event emitted');
    setWaiting(false); // Reset waiting state locally
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center', color: 'white' }}>
      <h3>{waiting ? 'Waiting for another player...' : 'Join a Game'}</h3>
      {!waiting ? (
        <button onClick={startGame} style={buttonStyle}>
          Start Game
        </button>
      ) : (
        <div>
          <p>Please wait for another player to join...</p>
          <button onClick={cancelQueue} style={buttonStyle}>
            Cancel Queue
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#007BFF',
  color: '#fff',
  marginTop: '10px',
  transition: 'background-color 0.3s',
};

export default GamePage;

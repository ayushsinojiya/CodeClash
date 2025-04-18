import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import Signup from './Signup';
import Navbar from './Navbar';
import CodeEditor from './CodeEditor';
import Training from './Training';
import GamePage from './GamePage'; // Import GamePage
import RankRating from './RankRating';
import QuestionsPage from './QuestionsPage';
import Coding from './1v1';
import Subject from './subject';
import QuestionDetail from './QuestionDetails';
import Chatbox from './Chatbox';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar is outside of Routes so it stays on all pages */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/training" element={<Training />} />
          <Route path="/playground" element={<CodeEditor />} />
          <Route path="/coding" element={<Coding />} />
          <Route path="/game" element={<GamePage />} /> {/* Add GamePage route */}
          <Route path="/subject" element={<Subject />} /> 
          <Route path="/details/:id" element={<QuestionDetail />} />
          <Route path="/chat" element={<Chatbox />} /> 
          <Route path="/rank-rating" element={<RankRating />} /> {/* Add RankRating route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

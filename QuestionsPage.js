import React, { useState, useEffect} from 'react';
import axios from 'axios';

const QuestionsPage = ({ difficultyOrder }) => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuestions(page);
  }, [page, difficultyOrder]); // Include difficultyOrder here if needed

  const fetchQuestions = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/questions?page=${page}`);
      setQuestions(response.data.questions);
      setTotalPages(Math.ceil(response.data.total / 25));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question._id}>
            <h3>{question['Question Title']}</h3>
            <p>{question['Question Text']}</p>
            <p>Difficulty: {question['Difficulty Level']}</p>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionsPage;

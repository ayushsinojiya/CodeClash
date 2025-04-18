CodeStandoff

CodeStandoff is an online 1v1 coding platform where two players compete against each other by solving programming problems in real-time. The platform allows users to practice coding skills, challenge other players, and improve their problem-solving abilities through a series of coding challenges.

Features

1v1 Matches: Players can compete against each other by solving randomly selected coding problems.

Live Chat: Players can chat during the match to strategize or discuss solutions.

Rank Rating: Players' performance is tracked, and they are given rankings based on their wins and losses.

Problem Database: The platform retrieves problems from a MongoDB database with questions categorized by difficulty.

Socket.io Support: Real-time communication and player synchronization using Socket.IO.

Real-time Code Execution: Powered by Piston API to compile and run code in various languages.

Technologies Used

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB (used for storing questions and user data)

Real-time Communication: Socket.IO

Code Execution: Piston API

Installation

To get started with the project locally:

Clone this repository to your local machine:

git clone https://github.com/yourusername/CodeStandoff.git

Navigate into the project directory:

cd CodeStandoff

Install dependencies for both backend and frontend:

For the backend (server-side):

cd server

npm install

For the frontend (client-side):

cd client

npm install

Start the development servers:

For the backend:

cd server

npm start

For the frontend:

cd client

npm start

The application will be running on http://localhost:3000 (frontend) and http://localhost:5000 (backend).

Contributing If you'd like to contribute to the project, feel free to submit a pull request. Here are a few ways you can help:

Fix bugs or improve existing features.

Add new problem categories or coding challenges.

Enhance the UI/UX.

Please make sure to test your changes locally before submitting a pull request.

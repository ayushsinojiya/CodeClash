import React from 'react';
import "./RankRating.css"

const RankRating = () => {
  const rankRating = 65; // Example rank rating
  const totalMatchesPlayed = 120; // Example total matches
  const totalWins = 85; // Example total wins
  const totalHoursPlayed = 48; // Example total hours
  const winStreak = 5; // Example win streak

  // Example match history data
  const matchHistory = [
    { matchNumber: 1, rankEarned: 20 },
    { matchNumber: 2, rankEarned: 15 },
    { matchNumber: 3, rankEarned: 10 },
    { matchNumber: 4, rankEarned: 25 },
    { matchNumber: 5, rankEarned: 30 },
  ];

  return (
    <div className="profile-page">
      <div className="header-image">
        {/* Background image section */}
      </div>
      <div className="player-details-container">
        <div className="details-box">
          <div className="player-name-section">
            <div className="player-name">Player Name</div>
          </div>

          <div className="rank-info">
            <div className="rank-rating-line">
              Rank Rating: <span className="rank-rating-value">{rankRating}/100</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${rankRating}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="rank-details">
            <div className="current-rank-box">
              Current Rank: <span className="rank-number"> Command-Line Commander
              </span>
            </div>
            <div className="peak-rank-box">
              Peak Rank: <span className="rank-number">Quantum Coder
              </span>
            </div>
          </div>
        </div>

        {/* Overall Section */}
        <div className="overall-section">
          <div className="overall-label">Overall</div>
          <div className="total-matches-box">
            Total Matches Played: <span>{totalMatchesPlayed}</span>
          </div>
          <div className="total-wins-box">
            Total Wins: <span>{totalWins}</span>
          </div>
          <div className="total-hours-box">
            Total Hours Played: <span>{totalHoursPlayed} hrs</span>
          </div>
          <div className="win-streak-box">
            Win Streak: <span>{winStreak}</span>
          </div>
        </div>

        {/* Match History Section */}
        <div className="match-history-container">
          <div className="match-history-label">Match History</div>
          <div className="match-history-list">
            {matchHistory.map((match, index) => (
              <div key={index} className="match-history-item">
                Match {match.matchNumber}: Rank Rating Earned: <span className="rank-earned">{match.rankEarned}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankRating;

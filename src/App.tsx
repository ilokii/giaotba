import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Breadcrumb from './components/Breadcrumb';
import LeagueList from './pages/LeagueList';
import League from './pages/League';
import Team from './pages/Team';
import Player from './pages/Player';
import Match from './pages/Match';
import { Players } from './pages/Players';
import Support from './pages/Support';

function App() {
  return (
    <Router>
      <div className="app">
        {/* 页头区域 */}
        <header className="header">
          <Navigation />
          <Breadcrumb />
        </header>

        {/* 主体内容区域 */}
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/leagues" replace />} />
            <Route path="/leagues" element={<LeagueList />} />
            <Route path="/leagues/:leagueId" element={<League />} />
            <Route path="/teams/:teamId" element={<Team />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:playerId" element={<Player />} />
            <Route path="/matches/:matchId" element={<Match />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
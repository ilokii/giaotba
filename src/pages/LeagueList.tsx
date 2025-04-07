import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';

export default function LeagueList() {
  const { isLoading, error, dataManager } = useData();

  if (isLoading) {
    return (
      <div className="container">
        <div className="section">
          <h2 className="title">联赛列表</h2>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="section">
          <h2 className="title">联赛列表</h2>
          <div className="error">加载失败: {error.message}</div>
        </div>
      </div>
    );
  }

  if (!dataManager) {
    return (
      <div className="container">
        <div className="section">
          <h2 className="title">联赛列表</h2>
          <div>暂无数据</div>
        </div>
      </div>
    );
  }

  const leagues = dataManager.getAllLeagues();

  return (
    <div className="container">
      <div className="section">
        <h2 className="title">联赛列表</h2>
        {leagues.length === 0 ? (
          <div>暂无联赛数据</div>
        ) : (
          <ul className="list">
            {leagues.map(league => {
              const teams = dataManager.getTeamsByLeague(league.id);
              const matches = dataManager.getMatchesByLeague(league.id);
              
              return (
                <li key={league.id} className="list-item">
                  <Link to={`/leagues/${league.id}`} className="link">
                    <div className="league-item">
                      <h3 className="league-name">{league.name}</h3>
                      <div className="league-info">
                        <span>球队数量: {teams.length}</span>
                        <span>比赛数量: {matches.length}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
} 
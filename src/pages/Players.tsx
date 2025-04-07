import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import PlayerLink from '../components/PlayerLink';
import { PlayerBase } from '../types/data';
import '../styles/Players.css';

export const Players: React.FC = () => {
  const navigate = useNavigate();
  const { dataManager } = useData();
  
  if (!dataManager) {
    return <div>加载中...</div>;
  }

  const playerBaseMap = dataManager.getPlayerBase() as Map<string, PlayerBase>;
  const players: Record<string, PlayerBase> = {};
  
  // 转换 Map 为对象
  playerBaseMap.forEach((player, id) => {
    players[id] = {
      ...player,
      photo: player.avatar || player.photo // 优先使用 avatar，如果没有则使用 photo
    };
  });

  return (
    <div className="players-container">
      <h1 className="players-title">联赛球员</h1>
      <div className="players-grid">
        {Object.entries(players).map(([id, player]) => (
          <div 
            key={id} 
            className="player-card"
            onClick={() => navigate(`/players/${id}`)}
          >
            <div className="player-avatar">
              <img src={player.photo} alt={player.name} />
            </div>
            <div className="player-name">
              <PlayerLink playerId={id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
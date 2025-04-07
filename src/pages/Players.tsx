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

  // 获取所有球员数据
  const playerBaseMapResult = dataManager.getPlayerBase();
  const players: Record<string, PlayerBase> = {};
  
  // 确保是Map类型并转换为对象
  if (playerBaseMapResult instanceof Map) {
    playerBaseMapResult.forEach((player, id) => {
      players[id] = {
        ...player,
        photo: player.avatar || player.photo || '/images/players/default.png'
      };
    });
  }

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
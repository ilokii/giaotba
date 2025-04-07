import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { PlayerBase } from '../types/data';

interface PlayerLinkProps {
  playerId: string;
  className?: string;
  showPhoto?: boolean;
  leagueName?: string;  // 联赛中使用的名字
  inLeague?: boolean;   // 是否在联赛场景中显示
}

export default function PlayerLink({ 
  playerId, 
  className = '', 
  showPhoto = false,
  leagueName,
  inLeague = false
}: PlayerLinkProps) {
  const { dataManager } = useData();
  
  // 获取球员基础信息
  const playerBaseResult = dataManager?.getPlayerBase(playerId);
  // 确保playerBase是PlayerBase类型而不是Map
  const playerBase = playerBaseResult && !(playerBaseResult instanceof Map) 
    ? playerBaseResult as PlayerBase 
    : null;
    
  if (!playerBase) return null;

  // 根据场景决定显示哪个名称
  const displayName = inLeague && leagueName ? leagueName : playerBase.name;

  // 获取球员头像，优先使用avatar
  const photoUrl = playerBase.avatar || playerBase.photo || '/images/players/default.png';

  return (
    <Link to={`/players/${playerId}`} className={`player-link ${className}`}>
      {showPhoto && (
        <img src={photoUrl} alt={playerBase.name} className="player-photo" />
      )}
      <span className="player-name">{displayName}</span>
    </Link>
  );
} 
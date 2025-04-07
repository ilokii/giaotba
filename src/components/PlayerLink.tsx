import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';

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
  const playerBase = dataManager?.getPlayerBase(playerId);
  if (!playerBase) return null;

  // 根据场景决定显示哪个名称
  const displayName = inLeague && leagueName ? leagueName : playerBase.name;

  return (
    <Link to={`/players/${playerId}`} className={`player-link ${className}`}>
      {showPhoto && playerBase.photo && (
        <img src={playerBase.photo} alt={playerBase.name} className="player-photo" />
      )}
      <span className="player-name">{displayName}</span>
    </Link>
  );
} 
import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayerBase } from '../hooks/usePlayerBase';
import PlayerName from './PlayerName';
import '../styles/PlayerLink.css';

interface PlayerLinkProps {
  playerId: string;
  inLeague?: boolean;  // 是否在联赛中显示
  leagueName?: string;  // 联赛中使用的名字
  className?: string;
}

const PlayerLink: React.FC<PlayerLinkProps> = ({
  playerId,
  inLeague = false,
  leagueName,
  className = '',
}) => {
  const playerBase = usePlayerBase(playerId);

  if (!playerBase) {
    return null;
  }

  const displayName = inLeague && leagueName ? (
    <PlayerName leagueName={leagueName} />
  ) : (
    playerBase.name
  );

  return (
    <Link to={`/players/${playerId}`} className={`player-link-plain ${className}`}>
      {displayName}
    </Link>
  );
};

export default PlayerLink; 
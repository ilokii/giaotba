import React from 'react';
import { getSupporterClass } from '../utils/supporters';
import '../styles/supporters.css';

interface PlayerNameProps {
  leagueName: string;
}

const PlayerName: React.FC<PlayerNameProps> = ({ leagueName }) => {
  const supporterClass = getSupporterClass(leagueName);
  
  return (
    <span className={supporterClass || undefined}>
      {leagueName}
    </span>
  );
};

export default PlayerName; 
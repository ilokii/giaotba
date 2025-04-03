import React from 'react';
import { Link } from 'react-router-dom';

const LeagueList: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">所有联赛</h1>
      <div className="grid gap-4">
        {/* 联赛列表将在这里显示 */}
      </div>
    </div>
  );
};

export default LeagueList; 
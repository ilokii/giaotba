import React from 'react';
import { useParams } from 'react-router-dom';

const League: React.FC = () => {
  const { leagueId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">联赛详情</h1>
      <div className="grid gap-4">
        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">联赛信息</h2>
          {/* 联赛信息将在这里显示 */}
        </section>

        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">参赛球队</h2>
          {/* 球队列表将在这里显示 */}
        </section>

        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">最近比赛</h2>
          {/* 比赛列表将在这里显示 */}
        </section>
      </div>
    </div>
  );
};

export default League; 
import React from 'react';
import { useParams } from 'react-router-dom';

const Match: React.FC = () => {
  const { matchId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">比赛详情</h1>
      <div className="grid gap-4">
        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">比分信息</h2>
          {/* 比分信息将在这里显示 */}
        </section>

        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">球员数据</h2>
          {/* 球员数据将在这里显示 */}
        </section>

        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">比赛统计</h2>
          {/* 比赛统计将在这里显示 */}
        </section>
      </div>
    </div>
  );
};

export default Match; 
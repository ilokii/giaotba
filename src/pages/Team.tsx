import React from 'react';
import { useParams } from 'react-router-dom';

const Team: React.FC = () => {
  const { teamId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">球队详情</h1>
      <div className="grid gap-4">
        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">球队信息</h2>
          {/* 球队信息将在这里显示 */}
        </section>

        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">球员名单</h2>
          {/* 球员列表将在这里显示 */}
        </section>

        <section className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">比赛记录</h2>
          {/* 比赛记录将在这里显示 */}
        </section>
      </div>
    </div>
  );
};

export default Team; 
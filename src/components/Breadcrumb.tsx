import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// 定义路径映射表
const pathMap: { [key: string]: string } = {
  '': '主页',
  'leagues': '联赛',
  'players': '球员',
  'teams': '球队',
  'matches': '比赛'
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // 如果是首页，不显示面包屑
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="breadcrumb">
      <Link to="/" className="breadcrumb-link">主页</Link>
      {pathnames.map((value, index) => {
        // 构建当前层级的路径
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // 获取显示名称
        const displayName = pathMap[value] || value;

        return (
          <React.Fragment key={routeTo}>
            <span className="breadcrumb-separator">/</span>
            {isLast ? (
              <span className="breadcrumb-current">{displayName}</span>
            ) : (
              <Link to={routeTo} className="breadcrumb-link">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
} 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { PlayerBase } from '../types/data';

// 定义路径映射表
const pathMap: { [key: string]: string } = {
  '': '主页',
  'leagues': '联赛',
  'players': '联赛球员',
  'teams': '球队',
  'matches': '比赛'
};

export default function Breadcrumb() {
  const location = useLocation();
  const { dataManager } = useData();
  const pathnames = location.pathname.split('/').filter(x => x);

  // 如果是首页，不显示面包屑
  if (pathnames.length === 0) {
    return null;
  }

  // 处理球员列表页面
  if (pathnames[0] === 'players' && !pathnames[1]) {
    return (
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">主页</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">联赛球员</span>
      </div>
    );
  }

  // 处理球员详情页面
  if (pathnames[0] === 'players' && pathnames[1] && dataManager) {
    const playerBase = dataManager.getPlayerBase(pathnames[1]) as PlayerBase | undefined;
    if (playerBase) {
      return (
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">主页</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/players" className="breadcrumb-link">联赛球员</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{playerBase.name}</span>
        </div>
      );
    }
  }

  // 处理球队详情页的特殊情况
  if (pathnames[0] === 'teams' && pathnames[1] && dataManager) {
    const team = dataManager.getTeam(pathnames[1]);
    if (team) {
      const league = dataManager.getLeague(team.leagueId);
      return (
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">主页</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/leagues" className="breadcrumb-link">联赛</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/leagues/${team.leagueId}`} className="breadcrumb-link">
            {league?.name || '未知联赛'}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{team.name}</span>
        </div>
      );
    }
  }

  // 处理联赛详情页
  if (pathnames[0] === 'leagues' && pathnames[1] && dataManager) {
    const league = dataManager.getLeague(pathnames[1]);
    if (league) {
      return (
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">主页</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/leagues" className="breadcrumb-link">联赛</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{league.name}</span>
        </div>
      );
    }
  }

  return (
    <div className="breadcrumb">
      <Link to="/" className="breadcrumb-link">主页</Link>
      {pathnames.map((value, index) => {
        // 构建当前层级的路径
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // 获取显示名称
        let displayName = pathMap[value] || value;

        // 如果是联赛ID，尝试获取联赛名称
        if (pathnames[0] === 'leagues' && index === 1 && dataManager) {
          const league = dataManager.getLeague(value);
          if (league) {
            displayName = league.name;
          }
        }

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
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { PlayerBase } from '../types/data';

export default function Player() {
  const { playerId } = useParams<{ playerId: string }>();
  const { isLoading, error, dataManager } = useData();
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('all');
  const [statsLeagueId, setStatsLeagueId] = useState<string>('all');

  // 获取球员数据
  const { playerBase, leagues, matchRecords, stats } = useMemo(() => {
    if (!dataManager || !playerId) {
      return { playerBase: null, leagues: [], matchRecords: [], stats: null };
    }

    // 获取球员基本信息
    const playerBaseResult = dataManager.getPlayerBase(playerId);
    // 确保playerBase是PlayerBase类型而不是Map
    const playerBase = playerBaseResult && !(playerBaseResult instanceof Map)
      ? playerBaseResult as PlayerBase
      : null;
      
    if (!playerBase) {
      return { playerBase: null, leagues: [], matchRecords: [], stats: null };
    }

    // 获取所有联赛
    const allLeagues = dataManager.getAllLeagues();
    
    // 获取所有比赛记录
    const allMatchRecords = allLeagues.flatMap(league => {
      const matches = dataManager.getMatchesByLeague(league.id);
      return matches
        .filter(match => match.playerStats?.[playerId]?.played)
        .map(match => {
          const homeTeam = dataManager.getTeam(match.homeTeam);
          const awayTeam = dataManager.getTeam(match.awayTeam);
          const playerTeam = homeTeam?.players.some(p => p.id === playerId) ? homeTeam : awayTeam;
          const opposingTeam = playerTeam === homeTeam ? awayTeam : homeTeam;
          const playerStats = match.playerStats?.[playerId];
          
          if (!homeTeam || !awayTeam || !playerTeam || !opposingTeam || !playerStats) {
            return null;
          }

          const playerInTeam = playerTeam.players.find(p => p.id === playerId);
          if (!playerInTeam) return null;

          return {
            matchId: match.id,
            leagueId: league.id,
            leagueName: league.name,
            playerLeagueName: playerInTeam.leagueName,
            time: match.time,
            teamName: playerTeam.name,
            opposingTeamName: opposingTeam.name,
            number: playerInTeam.number,
            points: playerStats.points,
            rebounds: playerStats.rebounds,
          };
        })
        .filter((record): record is NonNullable<typeof record> => record !== null);
    });

    // 计算统计数据
    const calculateStats = (leagueId: string) => {
      const filteredMatches = leagueId === 'all' 
        ? allMatchRecords 
        : allMatchRecords.filter(record => record.leagueId === leagueId);

      if (filteredMatches.length === 0) {
        return {
          gamesPlayed: 0,
          avgPoints: 0,
          avgRebounds: 0,
        };
      }

      const totalPoints = filteredMatches.reduce((sum, match) => sum + match.points, 0);
      const totalRebounds = filteredMatches.reduce((sum, match) => sum + match.rebounds, 0);
      const gamesPlayed = filteredMatches.length;

      return {
        gamesPlayed,
        avgPoints: Number((totalPoints / gamesPlayed).toFixed(1)),
        avgRebounds: Number((totalRebounds / gamesPlayed).toFixed(1)),
      };
    };

    return {
      playerBase,
      leagues: allLeagues,
      matchRecords: allMatchRecords,
      stats: calculateStats(statsLeagueId),
    };
  }, [dataManager, playerId, statsLeagueId]);

  // 筛选当前显示的比赛记录
  const filteredMatchRecords = useMemo(() => {
    if (!matchRecords) return [];
    return selectedLeagueId === 'all'
      ? matchRecords
      : matchRecords.filter(record => record.leagueId === selectedLeagueId);
  }, [matchRecords, selectedLeagueId]);

  if (isLoading) {
    return <div className="container">加载中...</div>;
  }

  if (error || !playerBase) {
    return <div className="container">加载失败</div>;
  }

  return (
    <div className="container">
      {/* 球员基本信息 */}
      <div className="player-header">
        <div className="player-info">
          {playerBase.avatar ? (
            <img src={playerBase.avatar} alt={playerBase.name} className="player-photo-large" />
          ) : playerBase.photo ? (
            <img src={playerBase.photo} alt={playerBase.name} className="player-photo-large" />
          ) : (
            <img src="/images/players/default.png" alt={playerBase.name} className="player-photo-large" />
          )}
          <h1 className="player-name-large">{playerBase.name}</h1>
        </div>
      </div>

      {/* 数据统计 */}
      <div className="player-section">
        <div className="section-header">
          <h2 className="section-title">数据统计</h2>
          <select 
            value={statsLeagueId} 
            onChange={(e) => setStatsLeagueId(e.target.value)}
            className="league-select"
          >
            <option value="all">生涯数据</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">场均得分</span>
            <span className="stat-value">{stats?.avgPoints.toFixed(1)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">场均篮板</span>
            <span className="stat-value">{stats?.avgRebounds.toFixed(1)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">出场次数</span>
            <span className="stat-value">{stats?.gamesPlayed}</span>
          </div>
        </div>
      </div>

      {/* 比赛记录 */}
      <div className="player-section">
        <div className="section-header">
          <h2 className="section-title">比赛记录</h2>
          <select 
            value={selectedLeagueId} 
            onChange={(e) => setSelectedLeagueId(e.target.value)}
            className="league-select"
          >
            <option value="all">全部联赛</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        <div className="matches-table-container">
          <table className="matches-table">
            <thead>
              <tr>
                <th>联赛</th>
                <th>时间</th>
                <th>球衣号码</th>
                <th>联赛名称</th>
                <th>球队</th>
                <th>对手</th>
                <th>得分</th>
                <th>篮板</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatchRecords.map(record => (
                <tr key={record.matchId}>
                  <td>{record.leagueName}</td>
                  <td>{new Date(record.time).toLocaleDateString()}</td>
                  <td>{record.number}</td>
                  <td>{record.playerLeagueName}</td>
                  <td>{record.teamName}</td>
                  <td>{record.opposingTeamName}</td>
                  <td>{record.points}</td>
                  <td>{record.rebounds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
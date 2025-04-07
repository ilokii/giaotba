import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import PlayerLink from '../components/PlayerLink';
import '../styles/Match.css';

interface PlayerMatchData {
  id: string;
  number: string;
  leagueName: string;
  played: boolean;
  points: number;
  rebounds: number;
}

export default function Match() {
  const { matchId } = useParams<{ matchId: string }>();
  const { isLoading, error, dataManager } = useData();

  const matchData = useMemo(() => {
    if (!dataManager || !matchId) return null;

    const match = dataManager.getMatch(matchId);
    if (!match) return null;

    const homeTeam = dataManager.getTeam(match.homeTeam);
    const awayTeam = dataManager.getTeam(match.awayTeam);
    if (!homeTeam || !awayTeam) return null;

    // 处理主队球员数据
    const homePlayerStats: PlayerMatchData[] = homeTeam.players.map(player => ({
      id: player.id,
      number: player.number,
      leagueName: player.leagueName,
      played: match.playerStats?.[player.id]?.played || false,
      points: match.playerStats?.[player.id]?.points || 0,
      rebounds: match.playerStats?.[player.id]?.rebounds || 0
    }));

    // 处理客队球员数据
    const awayPlayerStats: PlayerMatchData[] = awayTeam.players.map(player => ({
      id: player.id,
      number: player.number,
      leagueName: player.leagueName,
      played: match.playerStats?.[player.id]?.played || false,
      points: match.playerStats?.[player.id]?.points || 0,
      rebounds: match.playerStats?.[player.id]?.rebounds || 0
    }));

    // 按照是否上场和得分排序
    const sortPlayerStats = (stats: PlayerMatchData[]) => 
      stats.sort((a, b) => {
        if (a.played !== b.played) return b.played ? 1 : -1;
        return b.points - a.points;
      });

    return {
      match,
      homeTeam,
      awayTeam,
      homePlayerStats: sortPlayerStats(homePlayerStats),
      awayPlayerStats: sortPlayerStats(awayPlayerStats)
    };
  }, [dataManager, matchId]);

  if (isLoading) {
    return <div className="match-container">加载中...</div>;
  }

  if (error || !matchData) {
    return <div className="match-container">加载失败</div>;
  }

  const { match, homeTeam, awayTeam, homePlayerStats, awayPlayerStats } = matchData;

  return (
    <div className="match-container">
      {/* 比赛信息 */}
      <div className="match-header">
        <div className="match-time">
          {new Date(match.time).toLocaleDateString()}
        </div>
        <div className="match-score">
          <Link to={`/teams/${homeTeam.id}`} className="team-info">
            {homeTeam.logo && <img src={homeTeam.logo} alt={homeTeam.name} className="team-logo" />}
            <span className="team-name">{homeTeam.name}</span>
          </Link>
          <div className="score-display">
            <span className="score-number">{match.score?.home || 0}</span>
            <span className="score-separator">-</span>
            <span className="score-number">{match.score?.away || 0}</span>
          </div>
          <Link to={`/teams/${awayTeam.id}`} className="team-info">
            {awayTeam.logo && <img src={awayTeam.logo} alt={awayTeam.name} className="team-logo" />}
            <span className="team-name">{awayTeam.name}</span>
          </Link>
        </div>
      </div>

      {/* 球员数据 */}
      <div className="match-content">
        {/* 主队球员数据 */}
        <div className="team-stats">
          <h2 className="team-stats-title">{homeTeam.name}</h2>
          <table className="player-stats-table">
            <thead>
              <tr>
                <th>球员</th>
                <th>号码</th>
                <th>得分</th>
                <th>篮板</th>
              </tr>
            </thead>
            <tbody>
              {homePlayerStats.map(player => (
                <tr key={player.id} className={!player.played ? 'not-played' : ''}>
                  <td>
                    <div className="player-info">
                      <PlayerLink 
                        playerId={player.id}
                        leagueName={player.leagueName}
                        inLeague={true}
                        showPhoto={true}
                      />
                    </div>
                  </td>
                  <td className="player-number">{player.number}</td>
                  <td>{player.points}</td>
                  <td>{player.rebounds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 客队球员数据 */}
        <div className="team-stats">
          <h2 className="team-stats-title">{awayTeam.name}</h2>
          <table className="player-stats-table">
            <thead>
              <tr>
                <th>球员</th>
                <th>号码</th>
                <th>得分</th>
                <th>篮板</th>
              </tr>
            </thead>
            <tbody>
              {awayPlayerStats.map(player => (
                <tr key={player.id} className={!player.played ? 'not-played' : ''}>
                  <td>
                    <div className="player-info">
                      <PlayerLink 
                        playerId={player.id}
                        leagueName={player.leagueName}
                        inLeague={true}
                        showPhoto={true}
                      />
                    </div>
                  </td>
                  <td className="player-number">{player.number}</td>
                  <td>{player.points}</td>
                  <td>{player.rebounds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
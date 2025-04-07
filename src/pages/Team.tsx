import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Match, Team as TeamType } from '../types/data';
import PlayerLink from '../components/PlayerLink';

interface TeamStats {
  totalGames: number;
  wins: number;
  avgPoints: number;
  avgRebounds: number;
  pointsRank: number;
  reboundsRank: number;
  winsRank: number;
}

interface PlayerStats {
  id: string;
  name: string;
  number: string;
  photo?: string;
  avgPoints: number;
  avgRebounds: number;
}

export default function Team() {
  const { teamId } = useParams<{ teamId: string }>();
  const { isLoading, error, dataManager } = useData();

  // 获取球队基本信息和统计数据
  const { team, teamStats, playerStats, matches } = useMemo(() => {
    if (!dataManager || !teamId) {
      return { team: null, teamStats: null, playerStats: [], matches: [] };
    }

    const team = dataManager.getTeam(teamId);
    if (!team) {
      return { team: null, teamStats: null, playerStats: [], matches: [] };
    }

    const league = dataManager.getLeague(team.leagueId);
    const allTeams = dataManager.getTeamsByLeague(team.leagueId);
    const leagueMatches = dataManager.getMatchesByLeague(team.leagueId);

    // 计算球队统计数据
    const teamMatches = leagueMatches.filter(
      match => match.homeTeam === teamId || match.awayTeam === teamId
    );

    const wins = teamMatches.reduce((total, match) => {
      if (!match.score) return total;
      if (match.homeTeam === teamId && match.score.home > match.score.away) return total + 1;
      if (match.awayTeam === teamId && match.score.away > match.score.home) return total + 1;
      return total;
    }, 0);

    const totalPoints = teamMatches.reduce((total, match) => {
      if (!match.score) return total;
      return total + (match.homeTeam === teamId ? match.score.home : match.score.away);
    }, 0);

    const totalRebounds = teamMatches.reduce((total, match) => {
      if (!match.playerStats) return total;
      return total + Object.entries(match.playerStats)
        .filter(([playerId]) => team.players.some(p => p.id === playerId))
        .reduce((sum, [_, stats]) => sum + (stats.played ? stats.rebounds : 0), 0);
    }, 0);

    // 计算排名
    const teamsStats = allTeams.map(t => {
      const tMatches = leagueMatches.filter(
        match => match.homeTeam === t.id || match.awayTeam === t.id
      );
      const tWins = tMatches.reduce((total, match) => {
        if (!match.score) return total;
        if (match.homeTeam === t.id && match.score.home > match.score.away) return total + 1;
        if (match.awayTeam === t.id && match.score.away > match.score.home) return total + 1;
        return total;
      }, 0);
      const tPoints = tMatches.reduce((total, match) => {
        if (!match.score) return total;
        return total + (match.homeTeam === t.id ? match.score.home : match.score.away);
      }, 0);
      const tRebounds = tMatches.reduce((total, match) => {
        if (!match.playerStats) return total;
        return total + Object.entries(match.playerStats)
          .filter(([playerId]) => t.players.some(p => p.id === playerId))
          .reduce((sum, [_, stats]) => sum + (stats.played ? stats.rebounds : 0), 0);
      }, 0);
      return {
        id: t.id,
        wins: tWins,
        avgPoints: tPoints / tMatches.length,
        avgRebounds: tRebounds / tMatches.length,
      };
    }).sort((a, b) => b.avgPoints - a.avgPoints);

    const pointsRank = teamsStats.findIndex(t => t.id === teamId) + 1;
    const reboundsRank = [...teamsStats].sort((a, b) => b.avgRebounds - a.avgRebounds)
      .findIndex(t => t.id === teamId) + 1;
    const winsRank = [...teamsStats].sort((a, b) => b.wins - a.wins)
      .findIndex(t => t.id === teamId) + 1;

    const teamStats: TeamStats = {
      totalGames: teamMatches.length,
      wins,
      avgPoints: totalPoints / teamMatches.length,
      avgRebounds: totalRebounds / teamMatches.length,
      pointsRank,
      reboundsRank,
      winsRank,
    };

    // 计算球员统计数据
    const playerStats = team.players.map(player => {
      let totalPoints = 0;
      let totalRebounds = 0;
      let gamesPlayed = 0;

      // 计算总得分和总篮板
      teamMatches.forEach(match => {
        const playerStat = match.playerStats?.[player.id];
        if (playerStat?.played) {
          totalPoints += playerStat.points;
          totalRebounds += playerStat.rebounds;
          gamesPlayed++;
        }
      });

      return {
        id: player.id,
        leagueName: player.leagueName,
        number: player.number,
        avgPoints: gamesPlayed > 0 ? totalPoints / gamesPlayed : 0,
        avgRebounds: gamesPlayed > 0 ? totalRebounds / gamesPlayed : 0,
      };
    }).sort((a, b) => b.avgPoints - a.avgPoints);

    return {
      team,
      teamStats,
      playerStats,
      matches: teamMatches.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()),
    };
  }, [dataManager, teamId]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error || !team || !teamStats) {
    return <div>加载失败</div>;
  }

  return (
    <div className="container">
      {/* 球队基本信息 */}
      <div className="team-header">
        <div className="team-info">
          {team.logo && <img src={team.logo} alt={team.name} className="team-logo-large" />}
          <h1 className="team-name-large">{team.name}</h1>
          <div className="team-basic-stats">
            <div className="stat-item">
              <span className="stat-label">胜场</span>
              <span className="stat-value">{teamStats.wins}</span>
              <span className="stat-rank">联盟第 {teamStats.winsRank} 名</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">场均得分</span>
              <span className="stat-value">{teamStats.avgPoints.toFixed(1)}</span>
              <span className="stat-rank">联盟第 {teamStats.pointsRank} 名</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">场均篮板</span>
              <span className="stat-value">{teamStats.avgRebounds.toFixed(1)}</span>
              <span className="stat-rank">联盟第 {teamStats.reboundsRank} 名</span>
            </div>
          </div>
        </div>
      </div>

      {/* 球员名单 */}
      <div className="team-section">
        <h2 className="section-title">球员名单</h2>
        <div className="players-table-container">
          <table className="players-table">
            <thead>
              <tr>
                <th>球员</th>
                <th>号码</th>
                <th>场均得分</th>
                <th>场均篮板</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.map(player => (
                <tr key={player.id}>
                  <td className="player-info">
                    <PlayerLink 
                      playerId={player.id} 
                      showPhoto={true}
                      leagueName={player.leagueName}
                      inLeague={true}
                    />
                  </td>
                  <td>{player.number}</td>
                  <td>{player.avgPoints.toFixed(1)}</td>
                  <td>{player.avgRebounds.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 比赛记录 */}
      <div className="team-section">
        <h2 className="section-title">比赛记录</h2>
        <div className="matches-list">
          {matches.map(match => {
            if (!dataManager) return null;
            
            const opponent = dataManager.getTeam(
              match.homeTeam === team.id ? match.awayTeam : match.homeTeam
            );
            if (!opponent || !match.score) return null;

            const isWin = (match.homeTeam === team.id && match.score.home > match.score.away) ||
                         (match.awayTeam === team.id && match.score.away > match.score.home);

            return (
              <Link key={match.id} to={`/matches/${match.id}`} className="match-card">
                <div className="match-teams">
                  <div className="team-info-with-logo">
                    {team.logo && <img src={team.logo} alt={team.name} className="team-logo-small" />}
                    <span className="team-name-small">{team.name}</span>
                  </div>
                  <div className="match-score">
                    <span className={match.homeTeam === team.id ? (isWin ? 'winning-score' : 'losing-score') : (isWin ? 'losing-score' : 'winning-score')}>
                      {match.homeTeam === team.id ? match.score.home : match.score.away}
                    </span>
                    <span> - </span>
                    <span className={match.homeTeam === team.id ? (isWin ? 'losing-score' : 'winning-score') : (isWin ? 'winning-score' : 'losing-score')}>
                      {match.homeTeam === team.id ? match.score.away : match.score.home}
                    </span>
                  </div>
                  <div className="team-info-with-logo">
                    {opponent.logo && <img src={opponent.logo} alt={opponent.name} className="team-logo-small" />}
                    <span className="team-name-small">{opponent.name}</span>
                  </div>
                </div>
                <div className="match-info">
                  <span>{new Date(match.time).toLocaleDateString()}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
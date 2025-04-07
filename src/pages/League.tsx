import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Match, Team } from '../types/data';

interface PlayerStats {
  number: string;
  leagueName: string;
  teamName: string;
  teamLogo: string;
  avgPoints: number;
  avgRebounds: number;
  playedGames: number;
}

interface TeamWithWins extends Team {
  wins: number;
}

export default function League() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { isLoading, error, dataManager } = useData();

  // 计算球员统计数据
  const playerStats = useMemo(() => {
    if (!dataManager || !leagueId) return [];

    const league = dataManager.getLeague(leagueId);
    if (!league) return [];

    const matches = dataManager.getMatchesByLeague(leagueId);
    const teams = dataManager.getTeamsByLeague(leagueId);
    
    // 创建球员统计数据映射
    const statsMap = new Map<string, {
      number: string;
      leagueName: string;
      teamName: string;
      teamLogo: string;
      totalPoints: number;
      totalRebounds: number;
      playedGames: number;
    }>();

    // 初始化球员基础信息
    teams.forEach(team => {
      team.players.forEach(player => {
        statsMap.set(player.id, {
          number: player.number,
          leagueName: player.leagueName,
          teamName: team.name,
          teamLogo: team.logo || '',
          totalPoints: 0,
          totalRebounds: 0,
          playedGames: 0
        });
      });
    });

    // 统计比赛数据
    matches.forEach(match => {
      if (match.playerStats) {
        Object.entries(match.playerStats).forEach(([playerId, stats]) => {
          const playerData = statsMap.get(playerId);
          if (playerData && stats.played) {
            playerData.totalPoints += stats.points;
            playerData.totalRebounds += stats.rebounds;
            playerData.playedGames += 1;
          }
        });
      }
    });

    // 计算场均数据并排序
    return Array.from(statsMap.values())
      .map(stats => ({
        number: stats.number,
        leagueName: stats.leagueName,
        teamName: stats.teamName,
        teamLogo: stats.teamLogo,
        avgPoints: stats.playedGames > 0 ? Number((stats.totalPoints / stats.playedGames).toFixed(1)) : 0,
        avgRebounds: stats.playedGames > 0 ? Number((stats.totalRebounds / stats.playedGames).toFixed(1)) : 0,
        playedGames: stats.playedGames
      }))
      .sort((a, b) => 
        b.avgPoints === a.avgPoints 
          ? b.avgRebounds - a.avgRebounds 
          : b.avgPoints - a.avgPoints
      );
  }, [dataManager, leagueId]);

  // 计算球队胜场数据
  const teamsWithWins = useMemo(() => {
    if (!dataManager || !leagueId) return [];

    const teams = dataManager.getTeamsByLeague(leagueId);
    const matches = dataManager.getMatchesByLeague(leagueId);

    return teams.map(team => {
      const wins = matches.reduce((total, match) => {
        if (!match.score) return total;
        if (match.homeTeam === team.id && match.score.home > match.score.away) return total + 1;
        if (match.awayTeam === team.id && match.score.away > match.score.home) return total + 1;
        return total;
      }, 0);
      return { ...team, wins };
    }).sort((a, b) => b.wins - a.wins);
  }, [dataManager, leagueId]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="section">
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="section">
          <div className="error">加载失败: {error.message}</div>
        </div>
      </div>
    );
  }

  if (!dataManager || !leagueId) {
    return (
      <div className="container">
        <div className="section">
          <div>暂无数据</div>
        </div>
      </div>
    );
  }

  const league = dataManager.getLeague(leagueId);
  if (!league) {
    return (
      <div className="container">
        <div className="section">
          <div className="error">未找到联赛信息</div>
        </div>
      </div>
    );
  }

  const teams = dataManager.getTeamsByLeague(leagueId);
  const matches = dataManager.getMatchesByLeague(leagueId);

  return (
    <div className="container">
      {/* 联赛标题和参赛队伍 */}
      <div className="league-header">
        <h1 className="title">{league.name}</h1>
        <div className="teams-section">
          <div className="teams-grid">
            {teamsWithWins.map(team => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="team-card"
              >
                {team.logo && <img src={team.logo} alt={team.name} className="team-logo" />}
                <h3 className="team-name">{team.name}</h3>
                <div className="team-wins">{team.wins} 胜</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="league-content">
        {/* 左侧比赛列表 */}
        <div className="matches-section">
          <h2 className="subtitle">全部比赛</h2>
          <div className="matches-list-container">
            <div className="matches-list">
              {matches.map(match => {
                const homeTeam = dataManager.getTeam(match.homeTeam);
                const awayTeam = dataManager.getTeam(match.awayTeam);
                
                if (!homeTeam || !awayTeam) return null;

                // 判断胜负
                const homeScore = match.score?.home || 0;
                const awayScore = match.score?.away || 0;
                const isHomeWin = homeScore > awayScore;
                const isAwayWin = awayScore > homeScore;

                return (
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="match-card"
                  >
                    <div className="match-teams">
                      <div className="team-info-with-logo">
                        {homeTeam.logo && <img src={homeTeam.logo} alt={homeTeam.name} className="team-logo-small" />}
                        <span className="team-name-small">{homeTeam.name}</span>
                      </div>
                      <div className="match-score">
                        <span className={!match.score ? '' : (isHomeWin ? 'winning-score' : 'losing-score')}>{match.score?.home || 0}</span>
                        <span> - </span>
                        <span className={!match.score ? '' : (isAwayWin ? 'winning-score' : 'losing-score')}>{match.score?.away || 0}</span>
                      </div>
                      <div className="team-info-with-logo">
                        {awayTeam.logo && <img src={awayTeam.logo} alt={awayTeam.name} className="team-logo-small" />}
                        <span className="team-name-small">{awayTeam.name}</span>
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

        {/* 右侧数据统计 */}
        <div className="stats-section">
          <h2 className="subtitle">数据统计</h2>
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>号码</th>
                  <th>球员</th>
                  <th>球队</th>
                  <th>得分</th>
                  <th>篮板</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((player, index) => (
                  <tr key={`${player.leagueName}-${player.number}`}>
                    <td>{player.number}</td>
                    <td>{player.leagueName}</td>
                    <td>
                      {player.teamLogo && (
                        <img src={player.teamLogo} alt={player.teamName} className="team-logo-small" />
                      )}
                    </td>
                    <td>{player.avgPoints}</td>
                    <td>{player.avgRebounds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
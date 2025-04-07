// 联赛数据类型
export interface League {
  id: string;
  name: string;
  teams: string[]; // 球队ID列表
  matches: string[]; // 比赛ID列表
}

// 球队数据类型
export interface Team {
  id: string;
  name: string;
  logo?: string;
  leagueId: string;
  players: Player[];
}

// 球队统计数据
export interface TeamStats {
  wins: number;
  losses: number;
  points: number;
  gamesPlayed: number;
}

// 球员基础信息类型
export interface PlayerBase {
  id: string;
  name: string;
  photo?: string;
  avatar?: string;
}

// 球员数据类型
export interface Player {
  id: string;
  name: string;
  number: string;
  photo?: string;
  leagueName: string;
}

// 球员统计数据
export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  gamesPlayed: number;
}

// 比赛数据类型
export interface Match {
  id: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  score?: {
    home: number;
    away: number;
  };
  playerStats?: {
    [playerId: string]: {
      played: boolean;
      points: number;
      rebounds: number;
    };
  };
}

// 比赛状态枚举
export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
}

// 比赛统计数据
export interface MatchStats {
  teamId: string;
  points: number;
  rebounds: number;
  players: PlayerMatchStats[];
}

export interface PlayerMatchStats {
  id: string;
  points: number;
  rebounds: number;
} 
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
  leagueId: string;
  logo?: string;
  players: {
    id: string;
    number: string;
    leagueName: string;
  }[];
  stats?: {
    wins: number;
    losses: number;
    points: number;
    gamesPlayed: number;
  };
}

// 球队统计数据
export interface TeamStats {
  wins: number;
  losses: number;
  points: number;
  gamesPlayed: number;
}

// 球员数据类型
export interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
  teamId: string;
  stats: PlayerStats;
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
  leagueId: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
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
  playerStats: {
    [playerId: string]: {
      points: number;
      rebounds: number;
      assists: number;
    };
  };
} 
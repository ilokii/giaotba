import { League, Team, Player, Match, PlayerBase } from '../types/data';

export default class DataManager {
  private static instance: DataManager;
  private cache: {
    leagues: Map<string, League>;
    teams: Map<string, Team>;
    players: Map<string, Player>;
    matches: Map<string, Match>;
    playerBase: Map<string, PlayerBase>;
  };

  private constructor() {
    this.cache = {
      leagues: new Map(),
      teams: new Map(),
      players: new Map(),
      matches: new Map(),
      playerBase: new Map()
    };
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // 数据加载方法
  public async loadData(): Promise<void> {
    try {
      // 加载联赛数据
      const leaguesResponse = await fetch('/data/leagues.json');
      const leaguesData = await leaguesResponse.json();
      this.validateAndCacheLeagues(leaguesData);

      // 加载球队数据
      const teamsResponse = await fetch('/data/teams.json');
      const teamsData = await teamsResponse.json();
      this.validateAndCacheTeams(teamsData);

      // 加载球员基础数据
      const playerBaseResponse = await fetch('/data/playerBase.json');
      const playerBaseData = await playerBaseResponse.json();
      this.validateAndCachePlayerBase(playerBaseData);

      // 加载比赛数据
      const matchesResponse = await fetch('/data/matches.json');
      const matchesData = await matchesResponse.json();
      this.validateAndCacheMatches(matchesData);
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error('Failed to load data');
    }
  }

  // 数据验证方法
  private validateAndCacheLeagues(data: Record<string, any>): void {
    Object.entries(data).forEach(([id, league]) => {
      if (this.validateLeague({ id, ...league })) {
        this.cache.leagues.set(id, { id, ...league });
      }
    });
  }

  private validateAndCacheTeams(data: Record<string, any>): void {
    Object.entries(data).forEach(([id, team]) => {
      if (this.validateTeam({ id, ...team })) {
        this.cache.teams.set(id, { id, ...team });
      }
    });
  }

  private validateAndCachePlayers(data: Record<string, any>): void {
    Object.entries(data).forEach(([id, player]) => {
      if (this.validatePlayer({ id, ...player })) {
        this.cache.players.set(id, { id, ...player });
      }
    });
  }

  private validateAndCacheMatches(data: Record<string, any>): void {
    Object.entries(data).forEach(([id, match]) => {
      if (this.validateMatch({ id, ...match })) {
        this.cache.matches.set(id, { id, ...match });
      }
    });
  }

  private validatePlayerBase(player: any): player is PlayerBase {
    return (
      typeof player.id === 'string' &&
      typeof player.name === 'string' &&
      (player.avatar === undefined || typeof player.avatar === 'string') &&
      (player.photo === undefined || typeof player.photo === 'string')
    );
  }

  private validateAndCachePlayerBase(data: Record<string, any>): void {
    Object.entries(data).forEach(([id, player]) => {
      if (this.validatePlayerBase({ id, ...player })) {
        this.cache.playerBase.set(id, { id, ...player });
      }
    });
  }

  // 数据验证器
  private validateLeague(league: any): league is League {
    return (
      typeof league.id === 'string' &&
      typeof league.name === 'string' &&
      Array.isArray(league.teams) &&
      Array.isArray(league.matches) &&
      league.teams.every((teamId: any) => typeof teamId === 'string') &&
      league.matches.every((matchId: any) => typeof matchId === 'string')
    );
  }

  private validateTeam(team: any): team is Team {
    return (
      typeof team.id === 'string' &&
      typeof team.name === 'string' &&
      typeof team.leagueId === 'string' &&
      Array.isArray(team.players) &&
      team.players.every((player: any) => 
        typeof player.id === 'string' &&
        typeof player.number === 'string' &&
        typeof player.leagueName === 'string'
      ) &&
      (!team.stats || this.validateTeamStats(team.stats))
    );
  }

  private validatePlayer(player: any): player is Player {
    return (
      typeof player.id === 'string' &&
      typeof player.name === 'string' &&
      typeof player.number === 'string' &&
      typeof player.position === 'string' &&
      typeof player.teamId === 'string' &&
      this.validatePlayerStats(player.stats)
    );
  }

  private validateMatch(match: any): match is Match {
    return (
      typeof match.id === 'string' &&
      typeof match.leagueId === 'string' &&
      typeof match.homeTeam === 'string' &&
      typeof match.awayTeam === 'string' &&
      typeof match.time === 'string' &&
      (!match.score || (
        typeof match.score === 'object' &&
        typeof match.score.home === 'number' &&
        typeof match.score.away === 'number'
      ))
    );
  }

  private validateTeamStats(stats: any): boolean {
    return (
      typeof stats === 'object' &&
      typeof stats.wins === 'number' &&
      typeof stats.losses === 'number' &&
      typeof stats.points === 'number' &&
      typeof stats.gamesPlayed === 'number'
    );
  }

  private validatePlayerStats(stats: any): boolean {
    return (
      typeof stats === 'object' &&
      typeof stats.points === 'number' &&
      typeof stats.rebounds === 'number' &&
      typeof stats.assists === 'number' &&
      typeof stats.steals === 'number' &&
      typeof stats.blocks === 'number' &&
      typeof stats.gamesPlayed === 'number'
    );
  }

  // 数据获取方法
  public getLeague(id: string): League | undefined {
    return this.cache.leagues.get(id);
  }

  public getTeam(id: string): Team | undefined {
    return this.cache.teams.get(id);
  }

  public getPlayer(id: string): Player | undefined {
    return this.cache.players.get(id);
  }

  public getMatch(id: string): Match | undefined {
    return this.cache.matches.get(id);
  }

  public getPlayerBase(id?: string): PlayerBase | undefined | Map<string, PlayerBase> {
    if (id) {
      return this.cache.playerBase.get(id);
    }
    return this.cache.playerBase;
  }

  // 列表获取方法
  public getAllLeagues(): League[] {
    return Array.from(this.cache.leagues.values());
  }

  public getTeamsByLeague(leagueId: string): Team[] {
    const league = this.getLeague(leagueId);
    if (!league) return [];
    return league.teams
      .map(teamId => this.getTeam(teamId))
      .filter((team): team is Team => team !== undefined);
  }

  public getPlayersByTeam(teamId: string): Player[] {
    return Array.from(this.cache.players.values())
      .filter(player => player.teamId === teamId);
  }

  public getMatchesByLeague(leagueId: string): Match[] {
    const league = this.getLeague(leagueId);
    if (!league) return [];
    return league.matches
      .map(matchId => this.getMatch(matchId))
      .filter((match): match is Match => match !== undefined);
  }

  // 缓存清理方法
  public clearCache(): void {
    this.cache.leagues.clear();
    this.cache.teams.clear();
    this.cache.players.clear();
    this.cache.matches.clear();
    this.cache.playerBase.clear();
  }

  public getTeamIdByName(teamName: string): string | undefined {
    for (const [id, team] of this.cache.teams) {
      if (team.name === teamName) {
        return id;
      }
    }
    return undefined;
  }
} 
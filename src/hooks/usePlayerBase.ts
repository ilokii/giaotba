import { useData } from './useData';
import { PlayerBase } from '../types/data';

export const usePlayerBase = (playerId: string): PlayerBase | null => {
  const { dataManager } = useData();
  
  if (!dataManager) {
    return null;
  }

  const playerBaseResult = dataManager.getPlayerBase(playerId);
  
  // 确保 playerBase 是 PlayerBase 类型而不是 Map
  return playerBaseResult && !(playerBaseResult instanceof Map) 
    ? playerBaseResult as PlayerBase 
    : null;
}; 
import { useState, useEffect } from 'react';
import DataManager from '../utils/DataManager';

interface UseDataResult {
  isLoading: boolean;
  error: Error | null;
  dataManager: DataManager | null;
}

export function useData(): UseDataResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dataManager, setDataManager] = useState<DataManager | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const manager = DataManager.getInstance();
        await manager.loadData();
        setDataManager(manager);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { isLoading, error, dataManager };
} 
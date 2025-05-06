import supporters from '../../public/data/supporters.json';

export const getCurrentSeasonId = () => {
  return 'intime_giaot_league_s2';
};

export const getSupporterClass = (leagueName: string): string => {
  const currentSeasonId = getCurrentSeasonId();
  const currentSeasonSupporters = supporters.seasons[currentSeasonId];

  if (currentSeasonSupporters.golden.includes(leagueName)) {
    return 'supporter-golden';
  }

  if (currentSeasonSupporters.silver.includes(leagueName)) {
    return 'supporter-silver';
  }

  return '';
}; 
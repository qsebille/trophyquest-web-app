export interface PlayerSuiteItem {
  suiteId: string;
  gameId: number | null;
  title: string;
  platforms: string[];
  imageUrl: string | null;
  nbBronzeTrophies: number;
  nbSilverTrophies: number;
  nbGoldTrophies: number;
  nbPlatinumTrophies: number;
  nbEarnedBronzeTrophies: number;
  nbEarnedSilverTrophies: number;
  nbEarnedGoldTrophies: number;
  nbEarnedPlatinumTrophies: number;
  lastPlayedAt: string | null;
}

export interface PlayerSummaryResponse {
  playerId: string;
  pseudo: string;
  avatarUrl: string | null;
  nbPlayedSuites: number;
  nbEarnedBronzeTrophies: number;
  nbEarnedSilverTrophies: number;
  nbEarnedGoldTrophies: number;
  nbEarnedPlatinumTrophies: number;
}

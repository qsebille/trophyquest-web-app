export interface PlayerTrophyItem {
  trophyId: string;
  suiteId: string;
  gameId: number | null;
  suiteTitle: string;
  rank: number;
  title: string;
  description: string;
  color: string;
  iconUrl: string | null;
  earnedAt: string;
}

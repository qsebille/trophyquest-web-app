export const imageTypeLabels = {
  'psn-player': 'Player avatars',
  'psn-suite': 'Suite images',
  'psn-trophy': 'Trophy icons',
  'igdb-cover': 'Game covers',
  'igdb-background': 'Game backgrounds',
  'igdb-screenshot': 'Game screenshots',
} as const;

export type ImageType = keyof typeof imageTypeLabels;

export interface ImageCounts {
  type: ImageType;
  source: number;
  cached: number;
  pending: number;
}

export interface HistoryPoint {
  sampledAt: string;
  type: ImageType;
  pending: number;
}

export interface StatisticsResponse {
  measuredAt: string;
  images: readonly ImageCounts[];
  catalog: {
    associatedSuites: number;
    unassociatedSuites: number;
    gamesWithCover: number;
    gamesWithBackground: number;
    gamesWithoutBackground: number;
    gamesWithScreenshots: number;
    players: number;
    trophies: number;
  };
  history: readonly HistoryPoint[];
}

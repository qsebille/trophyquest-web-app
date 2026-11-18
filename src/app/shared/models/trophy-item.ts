export interface TrophyItem {
  trophyId: string
  rank: number
  title: string
  description: string
  color: string
  isHidden: boolean
  iconUrl: string | null
  groupName: string
  earnedAt: string | null
}

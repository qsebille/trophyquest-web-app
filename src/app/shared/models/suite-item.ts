export interface SuiteItem {
  suiteId: string
  title: string
  platforms: string[] | null
  imageUrl: string | null
  nbBronzeTrophies: number
  nbSilverTrophies: number
  nbGoldTrophies: number
  nbPlatinumTrophies: number
}

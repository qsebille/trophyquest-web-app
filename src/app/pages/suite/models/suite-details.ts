import {SuiteItem} from '@shared/models/suite-item';

export interface SuiteDetails extends SuiteItem {
  gameId: number | null;
}

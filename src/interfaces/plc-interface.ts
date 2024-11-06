import { PdsInterface } from './pds-interface';

export interface PlcInterface {
  name: string;
  pds: PdsInterface[];
  lastCrawledAt: Date | string;
}

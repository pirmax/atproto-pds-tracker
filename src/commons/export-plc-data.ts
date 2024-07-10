import fs from 'fs';
import { PlcInterface } from '../interfaces/plc-interface';
import { PdsInterface } from '../interfaces/pds-interface';

const exportPlcData = async (
  oldPlcs: PlcInterface[],
  newPlcs: PlcInterface[],
): Promise<void> => {
  for await (const oldPlc of oldPlcs) {
    for await (const newPlc of newPlcs) {
      const pds: PdsInterface[] = [...oldPlc.pds];

      for (const newPds of newPlc.pds) {
        const index: number = pds.findIndex(
          (pds: PdsInterface): boolean => pds.domain === newPds.domain,
        );

        if (index !== -1) {
          pds[index] = newPds;
        } else {
          pds.push(newPds);
        }
      }

      oldPlc.pds = pds;
      oldPlc.lastCrawledAt = newPlc.lastCrawledAt;
    }
  }

  fs.writeFileSync(
    'data.json',
    JSON.stringify(
      {
        plc: oldPlcs,
      },
      null,
      2,
    ),
  );
};

export default exportPlcData;

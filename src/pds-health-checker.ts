import describeServer from './commons/describe-server';
import exportPlcData from './commons/export-plc-data';
import { PlcInterface } from './interfaces/plc-interface';
import { PdsInterface } from './interfaces/pds-interface';
import { DescribeServerInterface } from './interfaces/server-output-interface';
import data from '../data.json';

(async (): Promise<void> => {
  const plcData: PlcInterface[] = (
    data as {
      plc: PlcInterface[];
    }
  ).plc;

  const plcList: PlcInterface[] = [];

  for await (const plcDatum of plcData) {
    const pdsList: PdsInterface[] = [];

    for await (const pds of plcDatum.pds) {
      try {
        const server: DescribeServerInterface = await describeServer(
          pds.domain,
        );

        pdsList.push({
          domain: pds.domain,
          isActive: true,
          isInviteCodeRequired: server.inviteCodeRequired ?? true,
          createdAt: pds.createdAt,
          indexedAt: pds.indexedAt,
          updatedAt: new Date(),
        });
      } catch (error) {
        pdsList.push({
          domain: pds.domain,
          isActive: false,
          isInviteCodeRequired: false,
          createdAt: pds.createdAt,
          indexedAt: pds.indexedAt,
          updatedAt: new Date(),
        });
      }
    }

    plcList.push({
      name: plcDatum.name,
      pds: pdsList,
      lastCrawledAt: new Date(),
    });
  }

  await exportPlcData(data.plc, plcList);
})();

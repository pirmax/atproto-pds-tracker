import getData from './commons/get-data';
import describeServer from './commons/describe-server';
import exportPlcData from './commons/export-plc-data';
import { PlcInterface } from './interfaces/plc-interface';
import { PdsInterface } from './interfaces/pds-interface';
import { DescribeServerInterface } from './interfaces/server-output-interface';
import { HEALTH_TIMEOUT } from './constants/timeouts';

(async (): Promise<void> => {
  const plcData: PlcInterface[] = await getData();
  const plcList: PlcInterface[] = [];

  for await (const plcDatum of plcData) {
    const pdsList: PdsInterface[] = [];

    for await (const pds of plcDatum.pds) {
      console.log(
        `Checking endpoint on directory (${plcDatum.name} - ${pds.domain})`,
      );

      const server: DescribeServerInterface | null = await describeServer(
        pds.domain,
        HEALTH_TIMEOUT,
      );

      if (server) {
        pdsList.push({
          domain: pds.domain,
          isActive: true,
          isInviteCodeRequired: server.inviteCodeRequired ?? true,
          createdAt: pds.createdAt,
          indexedAt: pds.indexedAt,
          updatedAt: new Date(),
        });
      } else {
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

  await exportPlcData(plcData, plcList);
})();

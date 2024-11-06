import getData from './commons/get-data';
import describeServer from './commons/describe-server';
import exportPlcData from './commons/export-plc-data';
import { PlcInterface } from './interfaces/plc-interface';
import { PdsInterface } from './interfaces/pds-interface';
import { DescribeServerInterface } from './interfaces/server-output-interface';
import {
  SERVER_DESCRIBE_TIMEOUT,
  SERVER_HEALTH_TIMEOUT,
} from './constants/timeouts';
import { ServerVersionInterface } from './interfaces/server-version-interface';
import versionServer from './commons/version-server';

(async (): Promise<void> => {
  const plcData: PlcInterface[] = await getData();
  const plcList: PlcInterface[] = [];

  for await (const plcDatum of plcData) {
    const pdsList: PdsInterface[] = [];

    for await (const pds of plcDatum.pds) {
      console.log(
        `Checking endpoint on directory ( ${plcDatum.name} - ${pds.domain} )`,
      );

      const serverDescription: DescribeServerInterface | null =
        await describeServer(pds.domain, SERVER_DESCRIBE_TIMEOUT);

      const serverVersion: ServerVersionInterface | null = await versionServer(
        pds.domain,
        SERVER_HEALTH_TIMEOUT,
      );

      if (serverDescription && serverVersion) {
        pdsList.push({
          domain: pds.domain,
          isActive: true,
          isInviteCodeRequired: serverDescription?.inviteCodeRequired ?? false,
          version: serverVersion?.version ?? null,
          createdAt: pds.createdAt,
          indexedAt: pds.indexedAt,
          updatedAt: new Date(),
        });
      } else {
        pdsList.push({
          domain: pds.domain,
          isActive: false,
          isInviteCodeRequired: false,
          version: null,
          createdAt: pds.createdAt,
          indexedAt: pds.indexedAt,
          updatedAt: new Date(),
        });
      }
    }

    plcList.push({
      name: plcDatum.name,
      pds: pdsList,
      lastCrawledAt: plcDatum.lastCrawledAt,
    });
  }

  await exportPlcData(plcData, plcList);
})();

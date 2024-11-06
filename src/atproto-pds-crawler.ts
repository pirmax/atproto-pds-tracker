import getData from './commons/get-data';
import plcExport from './commons/plc-export';
import describeServer from './commons/describe-server';
import getPdsServiceEndpoint from './commons/get-pds-endpoint';
import exportPlcData from './commons/export-plc-data';
import { PdsInterface } from './interfaces/pds-interface';
import { PlcInterface } from './interfaces/plc-interface';
import { DescribeServerInterface } from './interfaces/server-output-interface';
import { PlcExportInterface } from './interfaces/plc-export-interface';
import {
  SERVER_DESCRIBE_TIMEOUT,
  SERVER_VERSION_TIMEOUT,
} from './constants/timeouts';
import { ServerVersionInterface } from './interfaces/server-version-interface';
import versionServer from './commons/version-server';

(async (): Promise<void> => {
  const plcData: PlcInterface[] = await getData();
  const plcList: PlcInterface[] = [];

  for await (const plcDatum of plcData) {
    const endpoints: string[] = [];
    const pdsList: PdsInterface[] = [];

    let response: PlcExportInterface[] = [];

    try {
      response = await plcExport(
        plcDatum.name,
        new Date(plcDatum.lastCrawledAt),
      );
    } catch (error) {
      console.error(error);
      continue;
    }

    for await (const data of response) {
      let endpoint: string | null = null;

      try {
        endpoint = await getPdsServiceEndpoint(data['operation']);
      } catch (error) {
        console.error(error);
        continue;
      }

      if (endpoint !== null && !endpoints.includes(endpoint)) {
        console.log(
          `Checking endpoint on directory ( ${plcDatum.name} - ${endpoint} )`,
        );

        const serverDescription: DescribeServerInterface | null =
          await describeServer(endpoint, SERVER_DESCRIBE_TIMEOUT);

        const serverVersion: ServerVersionInterface | null =
          await versionServer(endpoint, SERVER_VERSION_TIMEOUT);

        if (serverDescription && serverVersion) {
          pdsList.push({
            domain: endpoint,
            isActive: true,
            isInviteCodeRequired:
              serverDescription?.inviteCodeRequired ?? false,
            version: serverVersion?.version ?? null,
            createdAt: new Date(data['createdAt']),
            indexedAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          pdsList.push({
            domain: endpoint,
            isActive: false,
            isInviteCodeRequired: false,
            version: null,
            createdAt: new Date(data['createdAt']),
            indexedAt: new Date(),
            updatedAt: new Date(),
          });
        }

        endpoints.push(endpoint);
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

import getData from './commons/get-data';
import plcExport from './commons/plc-export';
import describeServer from './commons/describe-server';
import getPdsServiceEndpoint from './commons/get-pds-endpoint';
import exportPlcData from './commons/export-plc-data';
import { PdsInterface } from './interfaces/pds-interface';
import { PlcInterface } from './interfaces/plc-interface';
import { DescribeServerInterface } from './interfaces/server-output-interface';
import { PlcExportInterface } from './interfaces/plc-export-interface';
import { CRAWL_TIMEOUT } from './constants/timeouts';

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
          `Checking endpoint on directory (${plcDatum.name} - ${endpoint})`,
        );

        const server: DescribeServerInterface | null = await describeServer(
          endpoint,
          CRAWL_TIMEOUT,
        );

        if (server) {
          pdsList.push({
            domain: endpoint,
            isActive: true,
            isInviteCodeRequired: server.inviteCodeRequired ?? true,
            createdAt: new Date(data['createdAt']),
            indexedAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          pdsList.push({
            domain: endpoint,
            isActive: false,
            isInviteCodeRequired: false,
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

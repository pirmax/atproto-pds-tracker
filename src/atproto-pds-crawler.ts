import plcExport from './commons/plc-export';
import describeServer from './commons/describe-server';
import getPdsServiceEndpoint from './commons/get-pds-endpoint';
import exportPlcData from './commons/export-plc-data';
import { PdsInterface } from './interfaces/pds-interface';
import { PlcInterface } from './interfaces/plc-interface';
import { DescribeServerInterface } from './interfaces/server-output-interface';
import { PlcExportInterface } from './interfaces/plc-export-interface';
import data from '../data.json';

(async (): Promise<void> => {
  const plcData: PlcInterface[] = (
    data as {
      plc: PlcInterface[];
    }
  ).plc;

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
        endpoint = getPdsServiceEndpoint(data['operation']);
      } catch (error) {
        console.error(error);
        continue;
      }

      if (endpoint !== null && !endpoints.includes(endpoint)) {
        try {
          const server: DescribeServerInterface =
            await describeServer(endpoint);

          pdsList.push({
            domain: endpoint,
            isActive: true,
            isInviteCodeRequired: server.inviteCodeRequired ?? true,
            createdAt: new Date(data['createdAt']),
            indexedAt: new Date(),
            updatedAt: new Date(),
          });
        } catch (error) {
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

  await exportPlcData(data.plc, plcList);
})();

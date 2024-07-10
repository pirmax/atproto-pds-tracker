import { PlcExportInterface } from '../interfaces/plc-export-interface';

const plcExport = async (
  plcAuthority: string,
  after: Date,
  count: number = 1000,
  timeout: number = 5000,
): Promise<PlcExportInterface[]> => {
  let response: Response;
  let result: PlcExportInterface[] = [];

  try {
    response = await fetch(
      `https://${plcAuthority}/export?after=${after.toISOString()}&count=${count}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(timeout),
      },
    );
  } catch (error) {
    return [];
  }

  try {
    result = (await response.text())
      .split('\n')
      .map((line: string) => JSON.parse(line));
  } catch (error) {
    return [];
  }

  return result;
};

export default plcExport;

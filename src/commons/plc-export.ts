import { PlcExportInterface } from '../interfaces/plc-export-interface';

const plcExport = async (
  plcAuthority: string,
  after: Date,
  count: number = 1000,
): Promise<PlcExportInterface[]> => {
  let response: Response;

  try {
    response = await fetch(
      `https://${plcAuthority}/export?after=${after.toISOString()}&count=${count}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error(error);
    return [];
  }

  return (await response.text())
    .split('\n')
    .map((line: string) => JSON.parse(line));
};

export default plcExport;

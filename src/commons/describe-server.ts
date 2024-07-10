import { DescribeServerInterface } from '../interfaces/server-output-interface';

const describeServer = async (
  endpoint: string,
  timeout: number = 5000,
): Promise<DescribeServerInterface | null> => {
  let response: Response;
  let result: DescribeServerInterface | null = null;

  try {
    response = await fetch(
      `${endpoint}/xrpc/com.atproto.server.describeServer`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(timeout),
      },
    );
  } catch (error) {
    return null;
  }

  try {
    result = await response.json();
  } catch (error) {
    return null;
  }

  return result;
};

export default describeServer;

import { ServerVersionInterface } from '../interfaces/server-version-interface';

const versionServer = async (
  endpoint: string,
  timeout: number = 5000,
): Promise<ServerVersionInterface | null> => {
  let response: Response;
  let result: ServerVersionInterface | null = null;

  try {
    response = await fetch(`${endpoint}/xrpc/_health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(timeout),
    });
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

export default versionServer;

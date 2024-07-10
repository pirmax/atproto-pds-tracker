import { BskyAgent } from '@atproto/api';
import { DescribeServerInterface } from '../interfaces/server-output-interface';

const describeServer = async (
  endpoint: string,
): Promise<DescribeServerInterface> => {
  const agent = new BskyAgent({
    service: endpoint,
  });

  const { data } = await agent.com.atproto.server.describeServer();

  return data;
};

export default describeServer;

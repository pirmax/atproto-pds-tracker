interface OperationInterface {
  services: {
    atproto_pds: {
      endpoint: string;
    };
  };
}

const getPdsServiceEndpoint = async (
  operation: OperationInterface,
): Promise<string | null> => {
  if (!operation) {
    return null;
  }

  if (!operation.services) {
    return null;
  }

  if (!operation.services.atproto_pds) {
    return null;
  }

  return operation.services.atproto_pds.endpoint;
};

export default getPdsServiceEndpoint;

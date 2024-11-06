export interface PlcExportInterface {
  did: string;
  operation: {
    services: {
      atproto_pds: {
        endpoint: string;
      };
    };
  };
  cid: string;
  nullified: boolean;
  createdAt: string;
}

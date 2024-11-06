export interface PdsInterface {
  domain: string;
  isActive: boolean;
  isInviteCodeRequired: boolean;
  version?: string | null;
  createdAt: Date | string;
  indexedAt: Date | string;
  updatedAt: Date | string;
}

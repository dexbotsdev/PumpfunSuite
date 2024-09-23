export enum BundleStatus {
  INIT,
  WGEN,
  FTRAN,
  BUND
}
export interface TokenMeta {
  _id: string;
  name: string;
  symbol: string;
  description?: string;
  metadataUrl: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  showName: boolean;
  mint: string;
  mintKey: string;
  bondingCurve: string;
  associatedBondingCurve: string;
  metadata: string;
  fundingwallet: string;
  devwallet: string;
  creatorwallet: string;
  bundleStatus: string;
  lookupTableAdress?: string; 
  createdAt?: Date;
  updatedAt?: Date;
}
;

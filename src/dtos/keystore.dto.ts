export interface IKeyStore {
  _id?: string;
  user?: string;
  privateKey?: string;
  publicKey?: string;
  refreshTokens?: Array<string>;
  $addToSet?: { refreshTokens: string };
  $pull?: { refreshTokens: string };
}

export interface IKeyStore {
  user: string;
  publicKey?: string;
  refreshToken?: string;
  refreshTokensUsed?: Array<string>;
}

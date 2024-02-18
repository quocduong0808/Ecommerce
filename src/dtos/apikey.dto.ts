export default interface IApiKey {
  key: string;
  status?: boolean;
  permissions?: Array<string>;
}

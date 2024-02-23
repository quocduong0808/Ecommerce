export default interface IApiKey {
  _id?: string;
  key: string;
  status?: boolean;
  permissions?: Array<string>;
}

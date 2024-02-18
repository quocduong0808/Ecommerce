export interface IShop {
  email: string;
  name?: string;
  password?: string;
  status?: string;
  verify?: boolean;
  roles?: Array<string>;
}

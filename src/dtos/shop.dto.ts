export interface IShop {
  _id?: string;
  email: string;
  name?: string;
  password?: string;
  status?: string;
  verify?: boolean;
  roles?: Array<string>;
}

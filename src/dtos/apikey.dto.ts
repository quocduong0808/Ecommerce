export default class ApiKeyDto {
  constructor(
    public key: string,
    public status: boolean,
    public permissions: Array<string>
  ) {}
}

export default class ApiRes<T> {
  constructor(
    public code: string,
    public status: string,
    public message: string,
    public result?: T
  ) {}
}

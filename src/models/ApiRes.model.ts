export default class ApiRes<T> {
  constructor(
    public code: string | number,
    public message: string,
    public result?: T
  ) {}
}

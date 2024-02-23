export default class ApiError extends Error {
  status: number;
  errorWithCommit = false;
  code = 'XXXXXX';
  constructor(
    status: number,
    message: string,
    errorWithCommit?: boolean,
    code?: string
  ) {
    super(message);
    this.status = status;
    this.errorWithCommit = errorWithCommit ? errorWithCommit : false;
    this.code = code ? code : 'XXXXXX';
  }
}

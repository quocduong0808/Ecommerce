export default class ApiError extends Error {
  status: number;
  errorWithCommit = false;
  constructor(status: number, message: string, errorWithCommit?: boolean) {
    super(message);
    this.status = status;
    this.errorWithCommit = errorWithCommit ? errorWithCommit : false;
  }
}

export default class ApiError extends Error {
  name: string;
  message: string;
  stack?: string | undefined;
  cause?: unknown;
  constructor(
    name: string,
    message: string,
    stack?: string | undefined,
    cause?: unknown
  ) {
    super();
    this.name = name;
    this.message = message;
    this.stack = stack;
    this.cause = cause;
  }
}

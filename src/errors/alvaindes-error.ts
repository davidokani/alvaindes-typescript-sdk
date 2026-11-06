export type AlvaindesErrorDetails = {
  status: number;
  message: string;
  response?: unknown;
  code?: string;
};

export class AlvaindesError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly response?: unknown;

  constructor(details: AlvaindesErrorDetails) {
    super(details.message);

    this.name = "AlvaindesError";
    this.status = details.status;

    if (details.code !== undefined) {
      this.code = details.code;
    }

    if (details.response !== undefined) {
      this.response = details.response;
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

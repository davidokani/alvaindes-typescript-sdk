import type { HttpTransport } from "../http/transport.js";
import type { CreateUserParams, UserResponse } from "../types/users.js";

export class UsersResource {
  constructor(private readonly transport: HttpTransport) {}

  /**
   * Creates a user under an application.
   *
   * Requires the user.create API scope.
   */
  create(
    applicationId: string,
    params: CreateUserParams,
  ): Promise<UserResponse> {
    return this.transport.request<UserResponse>(
      `/v1/applications/${encodeURIComponent(applicationId)}/users`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  /**
   * Retrieves a user belonging to an application.
   *
   * Requires the user.read API scope.
   */
  get(applicationId: string, userId: string): Promise<UserResponse> {
    return this.transport.request<UserResponse>(
      `/v1/applications/${encodeURIComponent(applicationId)}/users/${encodeURIComponent(userId)}`,
    );
  }
}

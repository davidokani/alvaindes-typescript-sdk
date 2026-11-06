export type CreateUserParams = {
  externalId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
};

export type UserResponse = {
  id: string;
  externalId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
};

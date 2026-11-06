export type KycDocumentType =
  | "PASSPORT"
  | "NATIONAL_ID"
  | "DRIVERS_LICENSE"
  | "VOTERS_CARD";

export type SubmitKycParams = {
  countryOfResidence: string;
  nationality?: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  addressCity: string;
  addressState?: string;
  addressPostalCode?: string;
  documentType: KycDocumentType;
  documentNumber?: string;
  documentUrl?: string;
  documentExpiryDate?: string;
  documentCountry?: string;
};

export type UpdateKycParams = Partial<SubmitKycParams>;

export type KycResponse = {
  id: string;
  userId: string;
  status: string;
  countryOfResidence: string | null;
  nationality: string | null;
  dateOfBirth: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressPostalCode: string | null;
  documentType: KycDocumentType | null;
  documentNumber: string | null;
  documentUrl: string | null;
  documentExpiryDate: string | null;
  documentCountry: string | null;
  approvedAt: string | null;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
};

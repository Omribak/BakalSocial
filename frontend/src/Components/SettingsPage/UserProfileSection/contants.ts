export type UpdateFormValues = {
  username?: string;
  email?: string;
  country: string;
  city: string;
};

export interface UpdateFormErrors {
  username?: string;
  email?: string;
  country?: string;
  city?: string;
}

export type UpdatePasswordValues = {
  password: string;
  confirmPassword: string;
};

export interface UpdatePassFormErrors {
  password?: string;
  confirmPassword?: string;
}

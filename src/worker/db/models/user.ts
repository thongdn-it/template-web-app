export type DBUserModel = {
  id: string;
  email: string;
  password_hash: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
  is_active: number;
  is_verified: number;
};

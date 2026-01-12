export type UserRole = "admin" | "petugas" | "owner";

export interface User {
  id_user: number;
  nama_lengkap: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

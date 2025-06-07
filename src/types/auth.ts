export interface User {
  userId: number;
  name: string;
  email: string;
  password: string | null;
  role: string;
  status: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

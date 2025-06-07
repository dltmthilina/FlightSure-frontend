import { User } from "./index";

export interface UserAuth {
  userId: number;
  email: string;
  password: string | null;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

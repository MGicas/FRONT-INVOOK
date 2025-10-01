import type { User, LoginResponse as AuthLoginResponse } from '../../../shared/domain/Auth';

export interface LoginCredentials {
  username: string;
  password: string;
}

export type LoginResponse = AuthLoginResponse;

export type { User };

export interface LoginFormState {
  username: string;
  password: string;
  error: string;
  isLoading: boolean;
}
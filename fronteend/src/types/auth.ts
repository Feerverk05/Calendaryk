export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
    message: string;
  }
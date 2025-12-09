

export interface UserProfile {
  email: string;
  createdAt: any;
}


export interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LogInFormValues {
  email: string;
  password: string;
}

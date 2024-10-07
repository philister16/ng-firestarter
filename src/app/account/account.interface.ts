// Define the UserData interface
export interface UserAccount {
  email: string;
  createdAt: Date;
  roles: string[];
  disabled: boolean;
  // Add any other fields that a user might have
}

// Define the UserData interface
export interface UserAccount {
  email: string;
  roles: string; // separate with double colon, e.g. admin::user
  displayName?: string;
  photoURL?: string;
  // Add any other fields that a user might have
}

// Define the UserData interface
export interface UserAccount {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
  roles?: string; // separate with double colon, e.g. admin::user
  // Add any other fields that a user might have
}

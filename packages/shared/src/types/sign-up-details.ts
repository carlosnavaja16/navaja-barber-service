import { UserProfile } from './user-profile.js';

export interface SignUpDetails {
  email: string;
  password: string;
  userProfile: UserProfile;
}

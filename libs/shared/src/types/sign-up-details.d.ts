import { UserProfile } from './user-profile';

export interface SignUpDetails {
  email: string;
  password: string;
  userProfile: UserProfile;
}

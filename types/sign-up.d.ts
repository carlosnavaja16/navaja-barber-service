import { UserProfile } from './user-profile';

export interface SignUp {
  email: string;
  password: string;
  userProfile: UserProfile;
}

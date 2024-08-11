export interface CreateUserProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddr: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddr: string;
  city: string;
  state: string;
  zipCode: string;
  isAdmin: boolean;
  userId: string;
  email: string;
}

export interface UserInfo {
  userToken: string;
  userProfile: UserProfile;
}

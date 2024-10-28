import { z } from 'zod';

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

export const UserProfileZod = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  streetAddr: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  isAdmin: z.boolean(),
  userId: z.string(),
  email: z.string(),
});

export interface UserInfo {
  userToken: string;
  userProfile: UserProfile;
}

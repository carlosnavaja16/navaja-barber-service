import { UserProfile } from "@navaja/shared";
import { FirestoreService } from "./firestore.service";

export class UserService {
  /**
   * Retrieves a user profile from Firestore.
   * @param userId - The UID of the user to retrieve the profile for.
   * @returns The user profile.
   */
  public static async getUserProfile(userId: string) {
    return await FirestoreService.getUserProfile(userId);
  }

  /**
   * Creates a user profile in Firestore.
   * @param userProfile - The user profile to create.
   */
  public static async createUserProfile(userProfile: UserProfile) {
    return await FirestoreService.createUserProfile(userProfile);
  }

  /**
   * Updates a user profile in Firestore.
   * @param userProfile - The user profile to update.
   */
  public static async updateUserProfile(userProfile: UserProfile) {
    return await FirestoreService.updateUserProfile(userProfile);
  }

  /**
   * Updates a user's email in Firestore.
   * @param userId - The UID of the user to update the email for.
   * @param email - The new email to set for the user.
   */
  public static async updateUserEmail(userId: string, email: string) {
    return await FirestoreService.updateUserEmail(userId, email);
  }
}

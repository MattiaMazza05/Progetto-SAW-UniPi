export type UserData = {
  fullName: string;
  gender: string;
  birthdate: string;
  height: number;
  email: string;
  photoURL: string | null;
  notificationTime?: string;
  notificationsEnabled?: boolean;
};
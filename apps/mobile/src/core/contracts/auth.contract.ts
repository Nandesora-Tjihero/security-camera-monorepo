import { Ref } from 'nativescript-vue';

export interface ScUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface IAuthService {
  user: Ref<ScUser | null>;
  signInWithGoogle(): Promise<ScUser | undefined>;
  convertToScUser(user: any): ScUser;
  signOut(): Promise<void>;
}

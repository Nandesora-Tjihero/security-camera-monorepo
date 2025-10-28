import { Ref } from 'nativescript-vue';
import { ScUser } from '../../../../security-camera/core/models/user.model';

export interface IAuthService {
  user: Ref<ScUser | null>;
  signInWithGoogle(): Promise<ScUser | undefined>;
  convertToScUser(user: any): ScUser;
  signOut(): Promise<void>;
}

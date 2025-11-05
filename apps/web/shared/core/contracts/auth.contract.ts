import type { User } from 'firebase/auth';
import type { ScUser } from '../models/user.model';

export interface IAuthService {
  signInWithGoogle(): Promise<User>;
  //   getCurrentUser(): Promise<User>;
  convertToScUser(user: User): ScUser;
  signOut(): Promise<void>;
}

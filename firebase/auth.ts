import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

// 파이어베이스 로그인
export const firebaseLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// 파이어베이스 로그아웃
export const firebaseLogout = async () => {
  await signOut(auth);
}
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase';
import { Alert } from 'react-native';

// 회원가입
export const firebaseSignUp = async (email: string, password: string) => {
  try {
    // 회원가입 자격 부여
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if(user) {
      await sendEmailVerification(user);
      console.log("이메일 전송 완료")
    }
  } catch(error: any) {
    if(error.code === "auth/invalid-email") {
      console.error("이미 가입된 이메일입니다.");
      Alert.alert("이미 가입된 이메일입니다.");
    }else {
      console.log("회원가입 실패", error);
    }
    
  }
}

// 파이어베이스 로그인
export const firebaseLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// 파이어베이스 로그아웃
export const firebaseLogout = async () => {
  await signOut(auth);
}
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendEmailVerification,
  getAuth, deleteUser
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
      console.log("이메일 전송 완료");
      await auth.signOut();
      return true;
    }
  } catch(error: any) {
    if(error.code === "auth/invalid-email") {
      console.error("이미 가입된 이메일입니다.");
      Alert.alert("이미 가입된 이메일입니다.");
    }else {
      console.log("회원가입 실패", error);
    }
  }
  return false;
}

// 파이어베이스 로그인
export const firebaseLogin = async (email: string, password: string) => {  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if(!user.emailVerified) {
      Alert.alert(
        '이메일 인증 필요',
        '이메일 인증을 해주세요.',
        [{text: '확인'}]
      );  
      // 이메일 인증 안했으면 로그아웃
      await auth.signOut();
      return;
    }
    
  } catch(error: any) {
    console.log('로그인 실패', error);
    if(error.code === "auth/invalid-credential"){
      Alert.alert("잘못된 계정입니다.")
    }
  }
  
  
}

// 파이어베이스 로그아웃
export const firebaseLogout = async () => {
  await signOut(auth);
}

// 파이어베이스 회원 탈퇴
export const firebaseDeleteAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if(!user) {
    console.warn("로그인된 사용자가 없습니다.");
    return;
  }

  try{
    await deleteUser(user); // 파이어베이스 유저 삭제
  } catch(error) {
    if(error) {
      console.error(error);
    } else {
      console.error("계정 삭제 오류", error);
    }
  }
}
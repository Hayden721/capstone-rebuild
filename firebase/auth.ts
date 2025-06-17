import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendEmailVerification,
  getAuth, deleteUser,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { Alert } from 'react-native';
import { uploadProfileImageAsync } from '@/firebase/storage';
import { signupProps, changePasswordProps } from '@/type/authType';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { UserMinus } from '@tamagui/lucide-icons';

// 회원가입
export const firebaseSignUp = async (email: string, password: string): Promise<signupProps> => {
  try {
    // 회원가입 자격 부여
    const defaultPhotoURL = "https://firebasestorage.googleapis.com/v0/b/micro-vine-456511-c5.firebasestorage.app/o/profile%2Fuser.png?alt=media&token=bec2f861-41c2-4c93-aabd-2521cd55e177";
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if(!user) {
      throw new Error("회원가입 실패: 유저 정보가 없습니다.");
    }

    // 기본 프로필 이미지 회원가입 시 즉시 업데이트
    await updateProfile(user, {
      photoURL: defaultPhotoURL,
    });
    // 이메일 인증 전송
    await sendEmailVerification(user);
    console.log("이메일 전송 완료");

    
    return {
      uid: user.uid,
      email: user.email!, // 타입 단언: string
      photoURL: user.photoURL! // 타입 단언: string
    }
    
  } catch(error: any) {
    console.error("회원가입 중 오류 발생:", error);
    throw error;
  }
};

// 회원가입 시 유저 정보 firestore에 저장
export const saveUserToFirestore = async (userData: signupProps) => {
  try{
    console.log("saveUserToFirestore", userData);
    const userDoc = {
      uid: userData.uid,
      email: userData.email,
      photoURL: userData.photoURL,
    }
    // 문서 아이디를 정해서 저장하기
    await setDoc(doc(db, "users", userData.uid), userDoc);
    await auth.signOut();
    console.log("Firestore 유저 정보 저장 성공")
  } catch(e) {
    console.error("firestore에 유저 정보 저장 실패 : ", e);
  }
  
}

// 파이어베이스 로그인
export const firebaseLogin = async (email: string, password: string) => {  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // if(!user.emailVerified) {
    //   Alert.alert(
    //     '이메일 인증 필요',
    //     '이메일 인증을 해주세요.',
    //     [{text: '확인'}]
    //   );  
    //   // 이메일 인증 안했으면 로그아웃
    //   await auth.signOut();
    //   return;
    // }
    
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

// 비밀번호 수정
export const firebaseChangePassword = async({currentPw, newPw, checkPw}:changePasswordProps)  => {
  const user = auth.currentUser;
  if(!user) {
    return {success: false, message: "로그인 상태가 아닙니다."};
  }
  if(!user.email) {
    return null;
  }
  if(newPw !== checkPw) {
    return null;
  }
  
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPw); // 사용자 이메일과 비밀번호로 credential생성
    await reauthenticateWithCredential(user, credential); // 현재 로그인 인증 재확인
    // 패스워드 변경
    await updatePassword(user, newPw);

    return {success: true, message: "비밀번호가 성공적으로 변경되었습니다."};
  }catch(e:any) {
    console.error("비밀번호 수정 실패 : ", e);
    let message = "오류가 발생했습니다.";
    if(e.code === "auth/wrong-password") {
      message = "비밀번호가 일치하지 않습니다.";
    } else if(e.error === 'auth/weak-password') {
      message = "비밀번호는 최소 ?자 이상이어야 합니다.";
    }
    return {success: false, message};
  }
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

// 파이어베이스 프로필 사진 변경
export const firebaseUpdateProfileImage = async ( imageUrl: string ) => {
  const user = auth.currentUser; // 현재 로그인된 계정

  if(!user) {
    throw new Error("로그인 상태가 아닙니다.");
  }
  await updateProfile(user, {
    photoURL: imageUrl,
  })
}

//파이어스토어 user컬렉션에 유저 photoURL을 업데이트
export const updateUserPhotoURL = async (uid: string, photoURL: string|null) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {photoURL});
    console.log("firebase user photoURL 업데이트 성공 ");
  } catch(error) {
    console.log("firebase user photoURL 업데이트 실패 : ", error);
  }
}

// 파이어베이스 Authentication 프로필 이미지 조회
export const getFirebaseProfileImage = (): string|null => {
  const user = auth.currentUser;
  return user?.photoURL ?? null;
}
// 유저의 프로필 이미지 변경
export const updateProfileImage = async (localImage: string): Promise<{
  name: string|null;
  email: string|null;
  photoUrl: string|null;
}> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("로그인된 사용자가 없습니다.");
  // 이미지를 firebase storage에 업로드 (return : 업로드한 이미지의 URL)
  const downLoadURL = await uploadProfileImageAsync(localImage, user.uid); 
  
  // 유저의 Authentication 업데이트
  await updateProfile(user, {photoURL: downLoadURL});

  return {
    name: user.displayName,
    email: user.email,
    photoUrl: user.photoURL
  }
}


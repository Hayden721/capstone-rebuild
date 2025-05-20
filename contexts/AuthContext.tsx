import React, {createContext, useEffect, useState} from "react";
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SimplifiedUser = {
  uid: string| null;
  email: string|null;
  photoURL: string|null; 
}
// auth 타입 정의
export type AuthContextType = {
  user: SimplifiedUser | null;
  setUser: React.Dispatch<React.SetStateAction<SimplifiedUser | null>>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<SimplifiedUser | null>(null); // firebase info
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    // 1. 먼저 캐시된 사용자 정보 불러오기
    const loadCachedUser = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem('user');
        if(cachedUser) {
          const parsedUser: SimplifiedUser = JSON.parse(cachedUser);
      setUser(parsedUser);
        }
      } catch(error){
        console.log('Error reading user from AsyncStorage', error);
      }
    }

    loadCachedUser();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('> onAuthStateChanged triggered');
      
      setLoading(true);
      
      try {
        if (user) { 
          console.log("> AuthContext.tsx 로그인 상태", user.email);
          const simplifiedUser: SimplifiedUser = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL ?? null,
          };

          setUser(simplifiedUser);
          await AsyncStorage.setItem('user', JSON.stringify(simplifiedUser));
        } else {
          console.log("? 로그인 안 된 상태");
          setUser(null); 
          await AsyncStorage.removeItem('user');
        }
      } catch (e) {
        console.error("> 오류 발생:", e);
        setUser(null);
        await AsyncStorage.removeItem('user');
      } finally {
        setLoading(false);
        console.log('> Auth loading end');
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser, loading}}>
      {children}
    </AuthContext.Provider>
  );
};
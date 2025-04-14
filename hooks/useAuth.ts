import { useState, useEffect } from "react";
import {onAuthStateChanged, User} from 'firebase/auth';
import { auth } from '../firebase';

// firebase 인증 
// firebase auth 로그인 상태 감지 hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null); //
  const [loading, setLoading] = useState(true); //

  console.log("로그인 상태", user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    })
    return () => unsubscribe();
  }, [])

  return {user, loading}
}


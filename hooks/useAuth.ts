
// firebase 인증 

import { AuthContext, AuthContextType } from "../contexts/AuthContext";
import { useContext } from "react";

// firebase auth 로그인 상태 감지 hook
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
}



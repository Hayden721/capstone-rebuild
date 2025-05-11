import { AuthContext, AuthContextType } from "../contexts/AuthContext";
import { useContext } from "react";

// firebase auth 로그인 상태 감지 hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context;
}
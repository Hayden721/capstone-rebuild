import { useContext } from "react";
import { ThemeContext } from '../contexts/ThemeContext';

// theme hooks
// ThemeContext에서 제공하는 테마 상태(themeMode)dhk 테마 토글 함수를 가져오는데 사용한다.
// ThemeProvider의 하위 컴포넌트에서만 사용 가능하다.
export const useThemeContext = () => {  
  const context = useContext(ThemeContext); // Context 값 가져오기
  if(!context) throw new Error('useThemeContext는 ThemeProvider안에서만 사용 가능합니다.');
  return context;
}
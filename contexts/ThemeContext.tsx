import React, { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 테마 상태 AsyncStorage에 저장 관련

type ThemeType = 'light' | 'dark'; // 다크모드, 라이트모드

interface ThemeContextProps {
  themeMode: ThemeType;
  toggleTheme: () => void;
}
// ThemeContext 생성. 초기값은 undefined로 설정
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [themeMode, setThemeMode] = useState<ThemeType>('light'); // 테마 값 변수
  const [loaded, setLoaded] = useState(false); // AsyncStorage 로딩 여부
  console.log("테마 값 : ", themeMode);
  
  // 테마 상태 값이 변할 때마다 수행
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
    const storedTheme = await AsyncStorage.getItem('themeMode'); // AsyncStorage에 저장된 테마값 가져오기
    console.log("AsyncStorage 테마 값 : ", storedTheme);
    if(storedTheme == 'light' || storedTheme == 'dark') {
      setThemeMode(storedTheme); // 테마 상태 값을 저장
    }
    setLoaded(true); // 로딩상태 '완료' 상태로 변경
  } catch (error) {
    console.log("실패")
  }
  };
  // 테마를 변경할 때 AsyncStorage에 저장한다. (현재 값이 light일 때 토글을 하면 dark값을 넣는다.)
  const toggleTheme = async () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    await AsyncStorage.setItem('themeMode', newTheme);
  }
  
  if(!loaded) return null; // 로딩이 끝날 때까지 아무것도 렌더링하지 않는다.

  return (
    // Context Provider를 사용해 하위 컴포넌트에 값을 전달할 수 있게 한다.
    <ThemeContext.Provider value={{themeMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};


import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Clipboard, MessageCircle, User } from '@tamagui/lucide-icons' // Tamagui용 아이콘
import { useTheme } from 'tamagui';

// 하단 탭 레이아웃

export default function BottomTabLayout() {
  const theme = useTheme();  

// (tabs)의 레이아웃, 스택 설정
// 오류 발생 시 +not-found.tsx 스크린으로 이동된다.
  return (
    
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.accent1.val,  // 바텀 탭 선택시 강조 색상
      tabBarStyle: { // 탭 바 스타일
        backgroundColor: theme.color1.val, // 탭 배경 색상
        borderTopWidth: 0, // 탭 위 선 없애기
        elevation: 0,
        paddingBottom: Platform.OS === 'android' ? 5 : 20, // 소프트 네비바 피하기 위해
        
      },
      headerStyle: { // 헤더 스타일
        backgroundColor: theme.color1.val,  // 헤더 배경 색상 
        borderBottomWidth: 0, // 헤더 바텀
        elevation: 0, // 안드로이드 그림자 제거
        shadowOpacity: 0, // iOS 그림자 제거
      },
      headerTitleStyle: {
        color: theme.color12.val,
      },
      headerTintColor: theme.color12.val,
      title: '',
      animation: 'none',
    }}
      >
      {/* NOTI : index.tsx(main)  */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color}/>,
          title: '홈',
          headerShown: false,
        }}
      />
      {/* NOTI : 게시판 상단 탭 */}
      <Tabs.Screen
        name="board"
        options={{
          title: '게시판',
          headerTitle: 'board',
          tabBarIcon: ({ color }) => <Clipboard size={24} color={color}/>,
          headerShown: false,
        }}
      />
      {/* NOTI : 채팅 */}
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          headerTitle: 'chat',
          headerShown: false,
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color}/>
        }}
      />
      {/* NOTI : 마이페이지 */}
      <Tabs.Screen
        name="my"
        options={{
          title: 'MY',
          headerShown: false,
          tabBarIcon: ({color}) => <User size={24} color={color}/>
          
        }}
      />
    </Tabs>
  );
}

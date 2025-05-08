import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Home, Clipboard, AlertCircle, MessageCircle, User } from '@tamagui/lucide-icons' // Tamagui용 아이콘
import { useTheme } from 'tamagui';

// 하단 탭 레이아웃

export default function BottomTabLayout() {
  const theme = useTheme();  

// (tabs)의 레이아웃, 스택 설정
// 오류 발생 시 +not-found.tsx 스크린으로 이동된다.
  return (
    
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: theme.accent1.val,  // 바텀 탭 선택시 강조 색상
      tabBarStyle: { // 탭 바 스타일
        backgroundColor: theme.color1.val, // 탭 배경 색상
        borderTopWidth: 0, // 탭 위 선 없애기
      },
      headerStyle: { // 헤더 스타일
        backgroundColor: theme.color1.val,  // 헤더 배경 색상 
        borderBottomWidth: 0, // 헤덜 바텀
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
        name="home"
        options={{
          title: '홈',
          headerTitle: 'home',
          
          tabBarIcon: ({ color }) => <Home size={24} color={color}/>,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 10}}>
                {({ pressed }) => (
                  <AlertCircle
                    size={24}
                    color={theme.color12.val}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      {/* NOTI : 게시판 상단 탭 */}
      <Tabs.Screen
        name="(board)"
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
          headerTitle: 'board',
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color}/>
        }}
      />
      {/* NOTI : 마이페이지 */}
      <Tabs.Screen
        name="(my)"
        options={{
          title: 'MY',
          headerTitle: '',
          tabBarIcon: ({color}) => <User size={24} color={color}/>,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 10}}>
                {({ pressed }) => (
                  <AlertCircle
                    size={24}
                    color={theme.color12?.val ?? '#000'}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          
        }}
      />

    </Tabs>
  );
}

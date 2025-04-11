import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Code, Home, Clipboard, AlertCircle, MessageCircle, User } from '@tamagui/lucide-icons' // Tamagui용 아이콘
import { useTheme } from 'tamagui';



// 하단 탭 레이아웃

export default function TabLayout() {
  const theme = useTheme();

  // const backgroundColor = theme.background?.val ?? '#fff'
  // const textColor = theme.color12?.val ?? '#000'
  // const activeTint = theme.accent?.val ?? 'hsla(104, 24%, 43%, 1)'
// expo-router 사용 시 '/'에 해당하는 파일을 지정하기 위해 index.tsx 사용한다.
// 사용하지 않을 시 +not-found.tsx 스크린으로 이동된다.
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: theme.accent1?.val,
      tabBarStyle: {
        backgroundColor: theme.color1?.val,
        borderTopWidth: 0,
        
      },
      headerStyle: {
        backgroundColor: theme.color1?.val,
        borderBottomWidth: 0,
        elevation: 0, // 안드로이드 그림자 제거
        shadowOpacity: 0, // iOS 그림자 제거
      },
      headerTitleStyle: {
        color: theme.color12?.val,
      },
      headerTintColor: theme.color12?.val,
      
    }}
      >
      <Tabs.Screen
        name="index"
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
                    color={theme.color12?.val}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: '게시판',
          headerTitle: 'board',
          tabBarIcon: ({ color }) => <Clipboard size={24} color={color}/>,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          headerTitle: 'board',
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color}/>
        }}
      />

      <Tabs.Screen
        name="my"
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

import { router, Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, Pressable, Button, TouchableWithoutFeedback, View } from "react-native";
import { Text, useTheme, Popover, YStack} from "tamagui";
import { ArrowLeft, ChevronLeft, AlignJustify, EllipsisVertical
} from '@tamagui/lucide-icons';

import majorTitleMap from '@/constants/majorTitleMap';
import { useState } from "react";
import PostDropDownMenu from "@/components/PostDropDownMenu";

// (main) layout / 바텀탭 레이아웃
export default function ListLayout() {
  const theme = useTheme();
  
  return (
    <Stack screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: theme.color1?.val, // 헤더 배경 색상
      },
      headerTintColor: theme.color12?.val, // 해더 글씨 색상
      headerTitleStyle: {
        fontWeight: 'bold', 
      },
      headerBackButtonDisplayMode: 'minimal'
      
    }}
    >    
    {/* <Stack.Screen
      name="myPosts"
      options={{
        title: '내가 쓴 게시글',
        headerShown: true,
      }}
    /> */}
{/* 
    <Stack.Screen 
      name="myComments" 
      options={{
        title: '내가 쓴 댓글',
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.color12?.val}/>
          </Pressable>
        ),
      }}
    /> */}

    {/* 전공별 게시판 리스트 */} 
    <Stack.Screen
      name="index"
    />
    {/* NOTI: 글작성  */}
    <Stack.Screen 
      name="write"
      options={{
        headerShown: false,
        headerBackTitle: '',
        title: '글쓰기',
      }}
    />
    {/* NOTI: 게시글 상세 */}
    <Stack.Screen 
      name="[postId]"
      options={{
        headerShown: false,
        headerBackTitle: '',
        title: '',
      }}
/>
    
  </Stack>
  )
}
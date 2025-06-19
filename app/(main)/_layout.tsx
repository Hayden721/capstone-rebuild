import { router, Stack } from "expo-router";
import { Pressable } from "react-native";
import { useTheme } from "tamagui";
import { ArrowLeft } from '@tamagui/lucide-icons';

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
    {/* NOTI: 게시판 목록 */}
    <Stack.Screen 
      name="(tabs)"
      options={{
        title: '목록'
      }}
    />
    
    <Stack.Screen
      name="myPosts"
      options={{
        title: '내가 쓴 게시글',
        headerShown: true,
      }}
    />

    <Stack.Screen 
      name="myComments" 
      options={{
        title: '내가 쓴 댓글',
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color={'$color12'}/>
          </Pressable>
        ),
      }}
    />    
  </Stack>
  )
}
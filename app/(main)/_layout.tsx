import { router, Stack } from "expo-router";
import { TouchableOpacity, Pressable } from "react-native";
import { Text, Button, useTheme} from "tamagui";
import { ArrowLeft } from '@tamagui/lucide-icons';
import majorTitleMap from '@/constants/majorTitleMap';


//
export default function ListLayout() {
    const theme = useTheme();

  return (
    //
    <Stack screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: theme.color1?.val, // 헤더 배경 색상
      },
      headerTintColor: theme.color12?.val, // 해더 글씨 색상
      headerTitleStyle: {
        fontWeight: 'bold', 
      },
    }}
    >
  
    <Stack.Screen
      name="myPosts"
      options={{
        title: '내가 쓴 게시글',
        headerShown: true,
        // headerLeft: () => (
        //   <Pressable onPress={() => router.back()}>
        //     <ArrowLeft size={24} color={theme.color12?.val}/>
        //   </Pressable>
        // ),
      }}
    />
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
    />
// 전공별 게시판 스택
<Stack.Screen
  name="major/[major]"
  options={({ route }) => {
    const { major } = route.params as {major: string};

    return {
      title: `${majorTitleMap[major] ?? major} 게시판`,
      // headerLeft: () => (
      //   <Pressable onPress={() => router.back()}>
      //     <ArrowLeft size={24} color={theme.color12?.val}/>
      //   </Pressable>
      // ),
      headerShown: true
    }
    
  }}
/>
<Stack.Screen 
  name="major/[major]/write" 
  options={{
    headerShown: true,
  }}
/>


  </Stack>
  )
}
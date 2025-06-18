import { ScrollView, StyleSheet, View } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, 
  useTheme} from 'tamagui';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '@/hooks/useThemeContext';
import { useEffect, useState } from 'react';
import { getPopularPosts } from '@/firebase/posts';
import { postProps1 } from '@/type/firebaseType';





// 홈 화면
export default function home() {
  const theme = useTheme();
  const { themeMode } = useThemeContext(); // 테마 상태 
  const [popularPosts, setPopularPosts] = useState<postProps1[]>();
  
  useEffect(()=> {
    const popularPosts = async() => {
      const posts = await getPopularPosts();
      setPopularPosts(posts);
      console.log("인기글 : ",posts)
    }
    popularPosts();
  },[])
  
  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.color1.val}}>
      <XStack style={{backgroundColor: theme.color1.val, height:50, alignItems:'center'}}>
        {themeMode === 'dark' ? 
          (<Image style={styles.logoImage} source={require('@/assets/images/logo/connect-logo-white-nonbg.png')}/> ) 
          : (<Image style={styles.logoImage} source={require('@/assets/images/logo/connect-logo-black-nonbg.png')}/> )
        }
      </XStack>
      {/* 본문 */}
      <ScrollView style={{padding: 10}}>
        
        <YStack>
          <Text style={[styles.titleStyle, {color: theme.color12.val}]}>오늘 할 일</Text>
        </YStack>

        <YStack style={{}}>
          <Text style={[styles.titleStyle, {color: theme.color12.val}]}>인기 글</Text>
          <YStack>
            {popularPosts?.map((post) => (
              <YStack key={post.id} style={[styles.postContainer, {backgroundColor: theme.color3.val}]}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent}>{post.content.length > 20 ? post.content.slice(0,20)+ '...' : post.content}</Text>
              </YStack>
            ))}
        </YStack>
        </YStack>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width:60,
    height:50
  },
  titleStyle: {
    padding:6,
    fontSize: 20, 
    fontWeight:'500'
  },
  postContainer: {
    height:88,
    borderRadius: 10,
    marginBottom:5,
    padding:10, 
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  postContent: {
    fontSize: 15,
    fontWeight: '500',
  }
})
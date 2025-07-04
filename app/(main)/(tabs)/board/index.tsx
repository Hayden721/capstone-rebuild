import { Alert, StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, H5,
  Separator, Theme, AnimatePresence, Image, styled, View, 
  useTheme, ScrollView} from 'tamagui';

import { useState } from 'react';
import { Pressable } from 'react-native';
import Divider from '@/components/Divider';
import { Link, useRouter } from 'expo-router';
import BoardList from '@/components/BoardList';
import { BookText, Code2, CircuitBoard, Lightbulb } from '@tamagui/lucide-icons';

// 상단탭의 메인페이지 (게시판 리스트 )

export default function index() {
const theme = useTheme(); // tamagui 테마
const router = useRouter(); // expo-router 사용

  return (  
    <ScrollView style={{flex:1, backgroundColor: theme.color1.val}}>
      <YStack style={{margin:10}}>
        {/* NOTI: 내가 작성한거 */}
        <YStack>
          <BoardList label='내가 쓴 글' screen="/(modals)/posts/myPosts" icon={BookText}/>
          <BoardList label='내가 쓴 댓글' screen="/(modals)/posts/myComments" icon={BookText}/>
        </YStack>
        
        <Divider/>

        <YStack>
        <BoardList label='자유게시판' screen="/(modals)/posts/free" icon={BookText}/>
        <BoardList label='정보게시판' screen="/(modals)/posts/free" icon={Lightbulb}/>
        </YStack>

        <Divider/>
        
        <YStack> 
          <H5>전공 게시판</H5>
          <BoardList label='컴퓨터공학' screen="/(modals)/posts/com" icon={Code2}/>
          <BoardList label='전자공학' screen="/(modals)/posts/elec" icon={CircuitBoard}/>
        </YStack>

        <Divider/>

      </YStack>
    </ScrollView>
  );
}




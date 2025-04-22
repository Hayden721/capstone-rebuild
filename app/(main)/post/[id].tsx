import { Alert, StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, H5,
  Separator, Theme, AnimatePresence, Image, styled, View, 
  useTheme, ScrollView} from 'tamagui';

import { useState } from 'react';
import { Pressable } from 'react-native';
import Divider from '@/components/Divider';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import BoardList from '@/components/BoardList';
import { BookText } from '@tamagui/lucide-icons';


export default function detail() {
const theme = useTheme();
const router = useRouter();
const {id} = useLocalSearchParams();
  return (
    <View>
      <Text>{id} 상세페이지</Text>
    </View>
  );
}




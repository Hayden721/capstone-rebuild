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
import { BookText } from '@tamagui/lucide-icons';


export default function write() {
const theme = useTheme();
const router = useRouter();
  return (
    <View>
      <Text>write</Text>
    </View>
  );
}




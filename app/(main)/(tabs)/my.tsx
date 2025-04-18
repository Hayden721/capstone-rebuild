import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons';
import { firebaseLogout } from '../../../services/authService';
import { useRouter } from 'expo-router';




// '/'에 해당하는 파일
export default function my() {
const theme = useTheme();
const router = useRouter();
//로그아웃
const handleFirebaseLogout = async () => {
    firebaseLogout();
}

    return (
    <View flex={1} backgroundColor="$background">
        <YStack>
            <XStack>
                <Button onPress={handleFirebaseLogout}>로그아웃</Button>
            </XStack>
        </YStack>
    </View>
    );
}
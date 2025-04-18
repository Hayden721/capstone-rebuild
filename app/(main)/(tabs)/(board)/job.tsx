import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';




export default function job() {
const theme = useTheme;

  return (
    <View flex={1} backgroundColor="$background">
      <YStack>
        <XStack>
          <Text>job</Text>
        </XStack>
      </YStack>
    </View>
  );
}

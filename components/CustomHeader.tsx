import { useTheme, XStack, Text, ColorTokens } from "tamagui";

import BackScreenButton from "./BackScreenButton";
import { Platform, StyleSheet } from 'react-native';

type CustomHeaderProps = {
  title?: string;
  showBackButton: boolean;
  children?: React.ReactNode;
  
}
// 커스텀 헤더
export const CustomHeader = ({title, showBackButton = true, children}: CustomHeaderProps) => {
  const theme = useTheme();

  return (
    <XStack style={[styles.header]}>
      <XStack style={{flex: 1, justifyContent:'flex-start'}} > 
        {showBackButton && <BackScreenButton/>}
      </XStack>
      <XStack style={{flex:1, justifyContent: 'center'}}>
        {title && <Text fontSize={16}>{title}</Text>}
      </XStack>
      <XStack style={{flex:1, justifyContent: 'flex-end'}}>
        {children}    
      </XStack>
    </XStack>
  )
}

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 40 : 50,
    alignItems: 'center',
  }
  
})
import { useTheme, XStack, Text } from "tamagui";

import BackScreenButton from "./BackScreenButton";

type CustomHeaderProps = {
  title?: string;
  showBackButton: boolean;
  children?: React.ReactNode;
}
// 커스텀 헤더
export const CustomHeader = ({title, showBackButton = true, children}: CustomHeaderProps) => {
  const theme = useTheme();

  return (
    <XStack height={50} alignItems='center' backgroundColor={theme.accent1?.val}>
      <XStack flex={1} justifyContent="flex-start"> 
        {showBackButton && <BackScreenButton/>}
      </XStack>
      <XStack flex={1} justifyContent="center">
        {title && <Text fontSize={16}>{title}</Text>}
      </XStack>
      <XStack flex={1} justifyContent="flex-end">
        {children}    
      </XStack>
    </XStack>
  )
}

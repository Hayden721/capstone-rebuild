import { Button, useTheme } from "tamagui"
import { StyleSheet } from "react-native"
import { Plus } from "@tamagui/lucide-icons"
import { router, useLocalSearchParams } from "expo-router"


const FixedAddButton: React.FC = () => {

  const { major } = useLocalSearchParams();
  const theme = useTheme();
  return (
  <Button 
    position="absolute" 
    bottom={20} 
    right={20} 
    width={60}
    height={60}
    borderRadius={30}
    size="$5" 
    backgroundColor={theme.accent1?.val}
    alignItems="center"
    justifyContent="center"
    icon={<Plus size={20} />}
    onPress={() => {
      router.push(`./${major}/write`);
    }}
    >
    
  </Button>
  )
}

export default FixedAddButton;

import { Button, useTheme } from "tamagui"
import { StyleSheet } from "react-native"
import { Plus } from "@tamagui/lucide-icons"
import { router, useLocalSearchParams } from "expo-router"


const PostAddButton: React.FC = () => {

  const { category } = useLocalSearchParams<{category: string}>();
  const theme = useTheme();
  return (
  <Button 
    style={{
      position:"absolute", bottom:30, right:30, borderRadius:30,
      backgroundColor: theme.accent1.val, alignItems:'center', justifyContent:'center'
    }}
    circular={true}
    size="$6" 
    icon={<Plus size={25} />}
    onPress={() => {
      router.push(`/posts/${category}/write`);
    }}
    >
  </Button>
  )
}

export default PostAddButton;

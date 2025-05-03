import { Text, View } from "react-native";
import { Button, useTheme } from 'tamagui';



export default function Index () {
  const theme = useTheme();

  return (
    <View style={{backgroundColor: theme.color1.val}}>
      <Text>
        hello
      </Text>
      <Button theme={"accent"}><Text>hello</Text></Button>
    </View>
  )
}
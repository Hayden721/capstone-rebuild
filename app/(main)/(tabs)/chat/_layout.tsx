import { Stack } from "expo-router";
import { useTheme } from "tamagui";

export default function ChatLayout() {
	const theme = useTheme();
	return (
		<Stack screenOptions={{
			headerStyle: {
				backgroundColor: theme.color1.val
			},
			headerShadowVisible: false,
			headerShown: false,
		}}>
			<Stack.Screen 
				name="index"
			/>

		</Stack>
	)
}
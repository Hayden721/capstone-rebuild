import { Stack } from "expo-router";
import { useTheme } from "tamagui";


export default function MyPageLayout () {
	const theme = useTheme();

	return (
		<Stack screenOptions={{
			headerShown: true,
			headerStyle: {
				backgroundColor: theme.color1.val,
				
			},
			headerShadowVisible: false,
		}}>
			<Stack.Screen 
				name='index'
				options={{
					title: '',
				}}/>
			<Stack.Screen
				name='changePassword'/>

		</Stack>
	)
}
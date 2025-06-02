import { Stack } from 'expo-router';

export default function ModalLayout() {
	return (
		<Stack
			screenOptions={{
				// presentation: 'modal', // iOS에서 모달처럼, Android에선 full screen
				headerShown: false,
			}}
		>
			<Stack.Screen
				name='chatroom'
				options={{
					presentation: 'modal',
					animation: 'slide_from_right'
				}}
			/>

			<Stack.Screen 
				name='preview'
				options={{
					animation: 'fade'
				}}
			/>

			<Stack.Screen
				name='menu'
				options={{
					presentation: 'card'
				}}
			/>
		</Stack>
		
	);
}
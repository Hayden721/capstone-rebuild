import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal', // iOS에서 모달처럼, Android에선 full screen
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='create'
      />

      <Stack.Screen 
        name='[chatroomId]'
        
      />
    </Stack>
    
  );
}
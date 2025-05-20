import { X } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "tamagui";


export default function ChatPreview() {
	const {chatroomId} = useLocalSearchParams();
	const router = useRouter();
	console.log("chatroomId : ", chatroomId);
	const chatroom = chatroomId as string;
	return (
		<SafeAreaView>
			<TouchableOpacity onPress={() => router.back()}>
				<X/>
			</TouchableOpacity>

			<Button onPress={()=> router.replace({
				pathname: "/(main)/(modals)/chat/[chatroomId]/chatroom",
				params: {chatroomId: chatroomId as string}
			})
			} theme={'accent'}>채팅방 입장</Button>
		</SafeAreaView>
	)
}
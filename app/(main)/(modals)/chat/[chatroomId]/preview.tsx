import BottomSheet from "@gorhom/bottom-sheet";
import { X } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack } from "tamagui";


export default function ChatPreview() {
	const {chatroomId} = useLocalSearchParams();
	const router = useRouter();
	console.log("chatroomId : ", chatroomId);
	const chatroom = chatroomId as string;

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const openSheet = () => {
    console.log("열기 시도");
    sheetRef.current?.expand();
  };

	return (
		<SafeAreaView style={{flex:1}}>
			<View>
				<TouchableOpacity onPress={() => router.back()}>
					<X/>
				</TouchableOpacity>
			</View>
			<YStack>
			<Button onPress={()=> router.replace({
				pathname: "/(main)/(modals)/chat/[chatroomId]/chatroom",
				params: {chatroomId: chatroomId as string}
			})
			} theme={'accent'}>채팅방 입장</Button>
			</YStack>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>


    </View>

		</SafeAreaView>
	)
}
import { CustomHeader } from "@/components/CustomHeader";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "tamagui";


export default function ChangePassword() {
	const theme = useTheme();
	return (
		<SafeAreaView style={{backgroundColor: theme.color1.val}}>
			<CustomHeader showBackButton={true}>

			</CustomHeader>
			<Text>비밀번호 변경</Text>
		</SafeAreaView>
	);
}
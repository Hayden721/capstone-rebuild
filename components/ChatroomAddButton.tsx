import { Button, useTheme } from "tamagui"
import { StyleSheet } from "react-native"
import { MessageCirclePlus } from "@tamagui/lucide-icons"
import { router} from "expo-router"


const ChatroomAddButton: React.FC = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		addButton: {
			position:"absolute", 
			bottom:20, 
			right:20, 
			width:60, 
			height:60, 
			
			backgroundColor: theme.accent1.val, 
			alignItems:'center', 
			justifyContent:'center'
		}
	})

	return (
	<Button 
		style={styles.addButton}
		size="$6" 
		circular={true}
		icon={<MessageCirclePlus size={20} />}
		onPress={() => {
			router.push(`/chat/create`);
		}}>
	</Button>
	)
}
export default ChatroomAddButton;

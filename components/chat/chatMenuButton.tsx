import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useTheme, Text } from "tamagui";

interface ChatMenuButtonProps {
	onPress: () => void;
	icon: React.ReactNode;
	title: string;
}

export const ChatMenuButton = ({onPress, icon, title}: ChatMenuButtonProps) => {
	const theme = useTheme();
	return (
		<View style={styles.menuContainer}>
			<TouchableOpacity
				onPress={onPress}
				style={[styles.menuToucableOpacity, {backgroundColor:theme.color02.val}]}
			>
				{icon}
			</TouchableOpacity>
			<Text>{title}</Text>
		</View>
	)

}

const styles = StyleSheet.create({
	menuContainer: {
		width:65, 
		height:85, 
		justifyContent:'center', 
		alignItems:'center'
	},
	menuToucableOpacity: {
		width: 65,
		height: 65,
		justifyContent:'center',
		alignItems: 'center',
		borderRadius: 60
	}
})
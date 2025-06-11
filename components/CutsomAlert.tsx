import React from 'react';
import { Dimensions, Modal, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'tamagui';


const CustomAlert = ({visible, title, message, onConfirm, onCancel, confirmText, cancelText, confirmColor, cancelColor}) => {
	const theme = useTheme();
	return (
		<Modal transparent visible={visible} animationType='fade' onRequestClose={onCancel}>
			<View style={styles.overlay}>
				<View style={[styles.alertBox, {backgroundColor: theme.color4.val}]}>
					{title ? <Text style={[styles.title, {color:theme.color12.val}]}>{title}</Text> : null}
					{message ? <Text style={[styles.message, {color:theme.color12.val}]}>{message}</Text> : null}
					
					<View style={[styles.buttonContainer, {borderColor: theme.color04.val}]}>

						<TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={[styles.confirmText, {color:confirmColor}]}>{confirmText}</Text>
            </TouchableOpacity>
						<View style={[styles.buttonDivider, {backgroundColor: theme.color04.val}]}></View>
						<TouchableOpacity style={styles.button} onPress={onCancel}>
							<Text style={[styles.cancelText, {color:cancelColor}]}>{cancelText}</Text>
						</TouchableOpacity>
						

					</View>
				</View>
			</View>
		</Modal>
	)
}


export default CustomAlert;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.75,
    backgroundColor: '#fff',
    borderRadius: 13,
    paddingTop: 20,
    paddingBottom: 0,
    
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.9,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDivider: {
    width: 0.7,
    
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmText: {
    
    fontSize: 15,
    fontWeight: '600',
  },
})
import { Check } from "@tamagui/lucide-icons"
import { XStack, Text } from "tamagui"


interface passwordCheckProps {
	password: string; 
	chkPassword: string;
}


export const PasswordCheck = ({password, chkPassword}: passwordCheckProps) => {
	const matchPassword = (password: string, chkPassword: string ) => {
  	if(password === '' || chkPassword === '') return false;
  	return password === chkPassword;
	}
	const getColor = (condition: boolean) => (condition ? '$accent1': '#999')
	const isMatch = matchPassword(password, chkPassword);
	
	return (
		<XStack style={{alignItems:'center'}}>
			<Check color={getColor(isMatch)}/>
			<Text color={getColor(isMatch)}>비밀번호 확인</Text>
		</XStack>
	)
}
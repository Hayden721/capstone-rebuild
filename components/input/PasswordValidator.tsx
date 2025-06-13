import { Check } from "@tamagui/lucide-icons";
import { useTheme, XStack, Text } from "tamagui";

interface passwordValidatorProps {
	password: string;
}

// 회원가입, 비밀번호 변경 등에서 사용하는 input
export const PasswordValidator = ({password}: passwordValidatorProps) => {
	const theme = useTheme();
	const hasLetter = /[a-zA-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSymbol = /[^a-zA-Z0-9]/.test(password);
	const getColor = (condition: boolean) => (condition ? theme.accent1 : '#999')
	return (
		
			<XStack>
				{/*  */}
				<XStack style={{alignItems: 'center'}}>
					<Check color={getColor(hasLetter)} />
					<Text color={getColor(hasLetter)}>영문포함</Text>
				</XStack>
				<XStack style={{alignItems:'center', marginLeft:10}}>
					<Check color={getColor(hasNumber)}/>
					<Text color={getColor(hasNumber)}>숫자포함</Text>
				</XStack>
				<XStack style={{alignItems:'center', marginLeft:10}}>
					<Check color={getColor(hasSymbol)}/>
					<Text color={getColor(hasSymbol)}>특수문자</Text>
				</XStack>
			</XStack>
		
	)
}





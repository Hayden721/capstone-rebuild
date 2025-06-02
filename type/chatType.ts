import { IMessage } from "react-native-gifted-chat";

export interface sendMessageProps {
	chatroomId: string;
	giftedMessage: IMessage;
}

export interface enterChatroomProps {
	chatroomId: string;
	userUid: string;
	userEmail: string;
}

export interface chatUserCheckProps {
	chatroomId: string;
	userUid: string;
}


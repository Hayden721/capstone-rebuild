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

export interface getChatroomProps {
	chatroomId: string;
	admin: string;
	title: string;
	explain: string;
	users: string[];
	imageURL: string;
	createdAt: Date;

}


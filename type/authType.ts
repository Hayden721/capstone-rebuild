export interface signupProps {
	uid: string;
	email: string;
	photoURL: string;
}

export interface changePasswordProps {
	currentPw: string;
	newPw: string;
	checkPw: string;
}
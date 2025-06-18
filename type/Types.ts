// 커스텀 Alert 타입
export interface customAlertProps {
	visible: boolean; // 활성화 / 비활성화
	title: string; // 제목
	message: string; // 내용
	onConfirm: ()=>void; // 확인할 때 실행할 함수
	onCancel: ()=>void; // 취소 함수 
	confirmText: string; // 
	cancelText: string; 
	confirmColor: string;
	cancelColor: string;
}
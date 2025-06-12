import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CustomHeader } from '@/components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Form, Input, Label, TextArea, useTheme, XStack, YStack, Button, Spinner } from 'tamagui';
import { useState } from 'react';
import pickImage from '@/utils/imagePicker';
import { Camera } from '@tamagui/lucide-icons';
import { createChatroom } from '@/firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { addUserToChatroom } from '@/firebase/chat';


export default function ChatCreateScreen() {
  const theme = useTheme();
  const [title, setTitle] = useState(''); // 채팅방 제목
  const [explain, setExplain] = useState(''); // 채팅방 내용
  const [imageUri, setImageUri] = useState<string|null>(null); // 선택한 채팅방 이미지
  const {user} = useAuth();
  const userUID = user?.uid as string;
  const userEmail = user?.email as string;
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const handleImagePicker = async () => {
    const pick = await pickImage({maxImages:1});
    
    // 선택된 이미지가 있을 때 imageUri 변경
    if(pick && pick.length > 0) {
      setImageUri(pick[0]);
    }
  }

  // 채팅방 생성
  const handleCreateChatroom = async() => {
    setCreateLoading(true)
    console.log("채팅방 이름 : ", title);
    console.log("채팅방 설명 : ", explain);
    console.log("채팅방 이미지 : ", imageUri);
    console.log("방 생성자(어드민) : ", user?.uid);
    try{
      // 1. 채팅방 정보를 firestore에 저장
      // 2. 이미지를 storage에 저장하고 이미지 url을 채팅방 firestore에 저장
      // 채팅방 생성 및 이미지 업로드 
      const chatroomId = await createChatroom({title, explain, imageUri, userUID});
      // chatrooms에 users문서 추가
      await addUserToChatroom({chatroomId: chatroomId, userUid: userUID, userEmail: userEmail});

      //3. 채팅방으로 이동
      router.replace(`/(main)/(modals)/chat/${chatroomId}/chatroom`);
    }catch(error) {
      console.log(error);
    }finally{
      setCreateLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:theme.color1.val}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack flex={1}>
          <YStack>
            <CustomHeader showBackButton={true}>
            </CustomHeader>
            
            <YStack style={{padding:10}}>
              <Form>
                {/* 채팅방 이미지 */}
                <XStack justify={'center'}>
                  <View>
                  <Avatar size={'$10'} borderRadius={10}>
                    <Avatar.Image
                      src={
                        imageUri 
                        ?
                          { uri: imageUri} 
                        : require('@/assets/images/Chill_guy.jpg')
                        }/>
                  </Avatar>

                    <TouchableOpacity onPress={handleImagePicker} style={styles.imageButton}>
                      <Camera size="$1.5"/>
                    </TouchableOpacity>
                  </View>
                </XStack>
                {/* 채팅방 이름 입력*/}
                <YStack>
                  <Label width={90} htmlFor="name">
                    채팅방 이름
                  </Label>
                  <Input id="name" value={title} onChangeText={setTitle}/>
                </YStack>

                {/* 채팅방 설명 */}
                <YStack>
                  <Label htmlFor="explain" width={90}>
                    채팅방 설명
                  </Label>
                  <TextArea id="explain" style={{height:200, textAlignVertical:'top'}} value={explain} onChangeText={setExplain}/>
                </YStack>

                <YStack style={{marginTop:18}}>
                  <Button onPress={handleCreateChatroom} theme={'accent'}>확인</Button>
                </YStack>
              </Form>
            </YStack>
          </YStack>

          {createLoading && (
          <View style={styles.loadingOverlay}>
            <Spinner size='large' color="$accent1"/>
          </View>
        )}

        </YStack>
        
        

      </TouchableWithoutFeedback>
    </SafeAreaView>


    
  );
}

const styles = StyleSheet.create({
  imageButton: {
    width: 31,
    height: 31,
    borderRadius: 50,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#999',
    bottom: -10,
    right: -10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // 전체 화면 덮기
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }
});
import { Alert, StyleSheet, KeyboardAvoidingView, Platform, TextInput,
  TouchableWithoutFeedback, Keyboard, Linking, TouchableOpacity, FlatList} from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, H5,
  Separator, Theme, AnimatePresence, Image, View,
  useTheme, ScrollView
} from 'tamagui';
import { Camera } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import pickImage from '@/utils/imagePicker';
import { uploadImageAsync } from '@/firebase/storage';
import { uploadPostToFirestore } from '@/firebase/posts';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomHeader } from '@/components/CustomHeader';

export default function write() {
const theme = useTheme();
const router = useRouter();
const { user } = useAuth();
const [title, setTitle] = useState(''); // 제목 
const [content, setContent] = useState(''); // 컨텐츠
const [imageUris, setImageUris] = useState<string[]>([]);
const { category } = useLocalSearchParams<{category: string}>(); // 현재 게시판 종류

//이미지 피커 사용 
const handleImagePicker = async() => {
  const result = await pickImage({maxImages: 5, currentUris: imageUris});
  if(result) {
    setImageUris(result);
  }
}
// 이미지 삭제
const removeImage = (uriToRemove: string) => {
  setImageUris(imageUris.filter(uri => uri !== uriToRemove));
}

// 게시글 업로드
const handleSubmit = async () => {

  try {
    // 이메일이 없다면 리턴 
    if (!user?.email) {
      console.error("유저 이메일이 없습니다.");
      return;
    }
    // user의 uid가 없으면 리턴
    if(!user?.uid) {
      console.error("유저 UID가 없습니다.");
      return;
    }
    const userUID = user.uid;
    const email = user.email;

    const urls = await Promise.all(
      imageUris.map((uri) => uploadImageAsync(uri, category))
    );

    const newPostId = await uploadPostToFirestore({
      title: title, // 게시글 제목
      content: content, // 게시글 내용
      imageURLs: urls, // 게시글 이미지
      userUID: userUID, // 유저 uid
      email: email, // 유저 email
      category: category, // 카테고리
    });
    // 게시글 작성을 완료하면 내가 작성한 게시글로 이동
    router.replace(`/(main)/(modals)/posts/${category}/${newPostId}`);

  } catch (err: any) {
    console.error("게시글 등록 에러:", err);
    Alert.alert("오류", err.message || "알 수 없는 오류가 발생했습니다.");
  }

  
};

const confirmSubmit = () => {
  Alert.alert(
    "등록",
    "게시글을 등록하시겠습니까?",
    [
      {
        text: "취소",
        style: "cancel"
      },
      {
        text: "등록",
        onPress: handleSubmit
      }
    ]
  )
}

  return (
    
  <SafeAreaView style={{ flex: 1, backgroundColor: theme.color1?.val }}>
    <CustomHeader showBackButton={true} title='글 작성'>
    </CustomHeader>
    {/* 키보드가 올라왔을 때 UI 가리지 않게 하기 */}
    
  <KeyboardAvoidingView
    style={{ flex: 1}}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={0}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flexGrow:1}}>
        <View style={{ paddingHorizontal: 15, flex: 1 }}>
          <TextInput
            placeholder="제목을 입력하세요"
            style={{
              fontSize: 18,
              borderBottomWidth: 0.5,
              marginBottom: 12,
              color: theme.color12?.val,
              paddingVertical: 12,
              borderBottomColor: "#999",
            }}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="내용을 입력하세요"
            multiline
            value={content}
            onChangeText={setContent}
            style={{
              backgroundColor: theme.color6.val,
              height: Platform.OS === 'ios' ? 500: 580,
              fontSize: 16,
              // paddingVertical: 12,
              color: theme.color12?.val,
              textAlignVertical: 'top',
            }}
            placeholderTextColor="#999"
          />
      
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          keyboardShouldPersistTaps='always'
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          style={{ backgroundColor: theme.color12.val }}
        >
          {imageUris.map((uri) => (
            <TouchableWithoutFeedback key={uri}>
              <View style={{ position: 'relative', width: 100, height: 100 }}>
                
                <Image
                  source={{ uri }}
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                />
                <TouchableOpacity
                  onPress={() => removeImage(uri)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 12,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    zIndex: 10,
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                    삭제
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
        
        </View>

        {/* 키보드 위 버튼 */}
        <View 
          style={{ marginTop: 'auto', flexDirection: 'row', 
            justifyContent: 'space-between', padding: 15, 
            alignItems:'center', backgroundColor: theme.color9.val}}  
        >
          <TouchableOpacity onPress={handleImagePicker} style={{ marginLeft: 10 }}>
            <Camera size="$2" color={'$color12'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmSubmit} style={{ marginRight: 10 }}>
            <Text fontSize="$5" fontWeight={600}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  
</SafeAreaView>

  );
}
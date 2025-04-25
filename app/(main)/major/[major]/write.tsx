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
import { uploadPostToFirestore } from '@/firebase/firestore';
import { auth } from '@/firebase';
export default function write() {
const theme = useTheme();
const router = useRouter();

const [title, setTitle] = useState(''); // 제목 
const [content, setContent] = useState(''); // 컨텐츠
const [imageUris, setImageUris] = useState<string[]>([]);
const { major } = useLocalSearchParams(); // 현재 게시판 종류
const majorString = major as string;
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
  const urls = await Promise.all(
    imageUris.map((uri) => uploadImageAsync(uri, majorString))
  );

  const newPostId = await uploadPostToFirestore({
    title,
    content,
    imageUrls: urls,
    major,
    userId: auth.currentUser?.email ?? 'anonymous',
  })
  // 게시글 작성을 완료하면 내가 작성한 게시글로 이동
  router.replace(`/major/${major}/${newPostId}`);
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
    // 키보드가 올라왔을 때 UI 가리지 않게 하기
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: theme.color1?.val }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={90}>
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
              height: 500,
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
          contentContainerStyle={{ paddingVertical: 10, gap: 10 }}
          keyboardShouldPersistTaps="handled"
          style={{ maxHeight: 120 }}
        >
          {imageUris.map((uri) => (
            <View key={uri} style={{ position: 'relative', width: 100, height: 100 }}>
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
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        </View>

        {/* 키보드 위 버튼 */}
        <View
          marginTop="auto"
          flexDirection="row"
          justifyContent="space-between"
          padding="20"
          alignItems="center"
          backgroundColor={theme.color1?.val}
        >
          <TouchableOpacity onPress={handleImagePicker} style={{ marginLeft: 10 }}>
            <Camera size="$2" backgroundColor={theme.color1?.val} />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmSubmit} style={{ marginRight: 10 }}>
            <Text fontSize="$5" fontWeight={600}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>

  );
}
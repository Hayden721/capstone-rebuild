import * as ImagePicker from 'expo-image-picker'; // 이미지 픽커
import { useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

export interface ImagePickerProps {
  maxImages?: number; // 최대 이미지
  currentUris?: string[]; // 현재 선택된 이미지
}

export const pickImage = async ({maxImages = 5, currentUris=[]}:ImagePickerProps ): Promise<string[] | null> => {
  
  console.log('pickImage 함수 호출됨');
  // 현재 이미지가 최대 개수를 초과한 경우
  if(currentUris.length >= maxImages) {
    Alert.alert(`이미지는 최대 ${maxImages}장 업로드할 수 있습니다.`);
    return null;
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  console.log('권한 상태:', status);
  
  // 권한 요청 
  if (status !== 'granted') {
    Alert.alert('사진 권한이 필요합니다.',
      '사진 업로드를 위해 설정에서 권한을 다시 허용해주세요.',
      [
        {
          text:'취소', style: 'cancel'
        },
        {
          text: '설정 열기',
          onPress: () => Linking.openSettings(),
        }
      ]
    )
    return null;
  }

  // 이미지 피커 띄우기
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],    
    allowsMultipleSelection: true,
    quality: 1,
  });
  // 이미지를 선택했을 때 
  if (!result.canceled && result.assets) {
    // 각 이미지의 uri만 추출
    const selectedImageUris = result.assets.map((asset) => asset.uri); 
    
    // 선택한 파일 압축하기
    const compressedUris = await Promise.all(
      selectedImageUris.map(uri => compressImage(uri))
    );

    // 현재 이미지와 새로 선택된 이미지 합치기
    return ([...currentUris, ...compressedUris].slice(0, maxImages)); // 이미지를 
  } else {
    console.log('사용자가 선택 취소함');
  }
  return null;
};
// 이미지 압축 함수
const compressImage = async(uri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{resize: {width: 1024}}],
    {
      compress:0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  )
  console.log("압축 이미지 : ", result.uri);
  return result.uri; // 압축 및 리사이징된 이미지 경로
}

export default pickImage;
import * as ImagePicker from 'expo-image-picker'; // 이미지 픽커
import { useState } from 'react';
import { Alert, Linking } from 'react-native';

export interface ImagePickerProps {
  maxImages?: number
  currentUris?: string[]
}

export const pickImage = async ({maxImages = 5, currentUris=[]}:ImagePickerProps ): Promise<string[] | null> => {
  
  console.log('pickImage 함수 호출됨');
  if(currentUris.length >= maxImages) {
    Alert.alert(`이미지는 최대 ${maxImages}장 업로드할 수 있습니다.`);
    return null;
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  console.log('권한 상태:', status);
  
  // 권한
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
    const selectedImageUris = result.assets.map((asset) => asset.uri);
    return ([...currentUris, ...selectedImageUris].slice(0, 5));
  } else {
    console.log('사용자가 선택 취소함');
  }
  return null;
};

export default pickImage;
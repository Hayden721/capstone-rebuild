import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';


const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function TopTabLayout() {
  const theme = useTheme();
  
  return (
    // SafeAreaView edges: 적용할 부분
    <SafeAreaView style={{flex: 1, backgroundColor: theme.color1?.val}}  edges={['top']}>
    <TopTabs
      screenOptions={({ route }) => ({
        tabBarScrollEnabled: true, // 탭이 많을 때 스크롤 가능 여부
        // 탭 바 스타일 설정
        tabBarStyle: {
          backgroundColor: theme.color1?.val, // 탭바 배경색
          elevation: 0, // Android 그림자 제거
          shadowOpacity: 0, // iOS 그림자 제거
          borderBottomWidth: 0, // 아래 테두리 추가
          borderBottomColor: '#eee', // 아래 테두리 색상
        },
        // 개별 탭 항목 스타일
        tabBarItemStyle: {
          width: 'auto', // 탭 너비 설정
          paddingHorizontal: 10, // 탭 간 좌우 간격
        },
        // 탭 텍스트 스타일
        tabBarLabelStyle: {
          fontSize: 18, // 폰트 크기
          fontWeight: 'bold', // 폰트 굵기
        },
        // 탭 선택 시 밑줄(indicator) 스타일 
        tabBarIndicatorStyle: {
          height: 0, 
        },
        tabBarActiveTintColor: theme.color12?.val, // 선택 탭 글자색
        tabBarInactiveTintColor: '#ccc', // 비선택 탭 글자색
        tabBarLabel:
          route.name === 'index' ? '게시판'
          : route.name === 'job' ? '직업 정보'
          : route.name,
    })}
  />
  </SafeAreaView>
);
}
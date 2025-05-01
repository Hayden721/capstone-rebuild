import { useRouter } from 'expo-router';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';
// 뒤로가기 버튼
const BackScreenButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} style={{}}>
      <ChevronLeft size={30}/>
    </TouchableOpacity>
  );
}

export default BackScreenButton;
import { StyleSheet, FlatList, TouchableOpacity, Pressable, Image } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, styled, View, 
  useTheme, H6} from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FixedAddButton from '@/components/FixedAddButton';




// '/'에 해당하는 파일
export default function MajorDetail() {
const theme = useTheme();
const router = useRouter();
const { major } = useLocalSearchParams(); // "com", "elec"
const posts = [
  {id:'1', title: '게시글', content: '내용'},
  {id:'2', title: '게시글', content: '내용'},
  {id:'3', title: '게시글', content: '내용'},
]

  return (
    <YStack flex={1} backgroundColor={theme.color1?.val}>
      <FlatList
        data={posts}
        keyExtractor={(item)=> item.id}
        renderItem={({item}) => (
          <View borderBottomWidth={1} borderColor={"#999"} > 
          <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)}>
            <View padding={10} borderColor="beige" flexDirection='row' justifyContent='space-between'>
              <View>
                <Text fontSize={19}>{item.title}</Text>
                <Text fontSize={16}>{item.content}</Text>
              </View>              
              <Image source={require('../../../assets/images/Chill_guy.jpg')} style={{width : 100, height : 100, borderRadius:10}}/>

            </View>
          </TouchableOpacity>
          </View>
        )}
        
        />
        
        
        {/* TODO: 고정된 게시글 추가 버튼 */}
        

      
      <FixedAddButton/>
    </YStack>  
  );
}



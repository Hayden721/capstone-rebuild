import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { YStack, XStack, Text, useTheme, Checkbox} from 'tamagui';
import { router, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '@/hooks/useThemeContext';
import { useEffect, useState } from 'react';
import { getPopularPosts } from '@/firebase/posts';
import { getPostProps } from '@/type/postType';
import { getChatroomProps } from '@/type/chatType';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { Check, List, ListCheck, Plus, ThumbsUp } from '@tamagui/lucide-icons';
import titleMap from '@/constants/titleMap';
import { checkChatroomSubscribeUser, getNewChatrooms } from '@/firebase/chat';
import { useAuth } from '@/hooks/useAuth';
import { getTodayTodo } from '@/firebase/todo';
import { getTodoProps } from '@/type/todoType';
// 홈 화면
export default function home() {
  const theme = useTheme();
  const {user} = useAuth();
  const { themeMode } = useThemeContext(); // 테마 상태 
  const [popularPosts, setPopularPosts] = useState<getPostProps[]>([]); // 인기글
  const [newChatroom, setNewChatroom] = useState<getChatroomProps[]>([]); // 새로운 채팅방
  const [todos, setTodos] = useState<getTodoProps[]>([]); 
  const router = useRouter();


  useEffect(()=> {
    const popularPosts = async() => {
      const posts = await getPopularPosts();
      setPopularPosts(posts);
      console.log("인기글 : ",posts)
    }
    popularPosts();
  },[])

  useEffect(() => {
    const newChatrooms = async () => {
      const chatrooms = await getNewChatrooms();
      setNewChatroom(chatrooms);
      console.log("chatrooms : ", chatrooms);
    }
    newChatrooms();
  }, [])
  useEffect(()=> {
    const fetchTodo = async () => {
      if(!user?.uid) {
        return;
      }
      const todo = await getTodayTodo(user?.uid);
      setTodos(todo);
    }
    fetchTodo();
  }, [])
  const handleChatroomAccess = async (item: any) => {
    if(!user?.uid) return;
    // 1. firestore /chatrooms/{chatroomId}/users에 내 email과 같은 아이디 있으면 true 반환
    const checkUser = await checkChatroomSubscribeUser({chatroomId: item, userUid: user.uid})
    console.log("함수 채팅방 id : ", item);
    if(checkUser) {
      router.push(`/(main)/(modals)/chat/${item}/chatroom`)
    } else {
      router.push(`/(main)/(modals)/chat/${item}/preview`)
    }
  }
  
  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.color1.val}}>
      <XStack style={{backgroundColor: theme.color1.val, height:50, alignItems:'center', paddingRight:10, paddingLeft:10}}>
        {themeMode === 'dark' ? 
          (<Image style={styles.logoImage} source={require('@/assets/images/logo/connect-logo-white-nonbg.png')}/> ) 
          : (<Image style={styles.logoImage} source={require('@/assets/images/logo/connect-logo-black-nonbg.png')}/> )
        }
      </XStack>
      {/* 본문 */}
      <ScrollView style={{paddingLeft: 10, paddingRight:10}}>
        
        <YStack>
          <Text style={[styles.titleStyle, {color: theme.color12.val}]}>오늘 할 일</Text>
          <YStack style={{height: 200, backgroundColor: theme.accent1.val, borderRadius: 10, padding:10}}>
            <ScrollView style={{flex:1}} nestedScrollEnabled={true}>
            {todos.map((todo)=> (
              <XStack key={todo.todoId} style={{alignItems: 'center', marginBottom:6}}>
                <Checkbox size="$6" style={{backgroundColor: theme.accent9.val, marginRight:4}} checked={todo.isComplete} onCheckedChange={() => {console.log("checked!")}}>
                  <Checkbox.Indicator style={{backgroundColor: theme.accent9.val}} >
                    <Check color={'$color12'}/>
                  </Checkbox.Indicator>
                </Checkbox>
                <Text style={{fontSize: 17, color: 'white'}}>{todo.content}</Text>
              </XStack>
            ))}
              
              
            </ScrollView>
            <XStack style={{height: 25, alignItems:'center', justifyContent:'flex-end'}}>
              <TouchableOpacity onPress={()=> router.push('/(main)/(modals)/todo/create')} style={[styles.todoButton ,{backgroundColor:theme.accent10.val}]}>
                <Plus size={'$1'} color={'white'}/>
                <Text style={{fontSize: 14,color:'white'}}>추가</Text>
              </TouchableOpacity>
              <View style={{margin:5}}></View>
              <TouchableOpacity onPress={()=> router.push('/(main)/(modals)/todo')} style={[styles.todoButton ,{backgroundColor:theme.accent10.val}]}>
                <ListCheck size={'$1'} color={'white'}/>
                <Text style={{fontSize:14, color: 'white'}}>전체보기</Text>
              </TouchableOpacity>
            </XStack>
          </YStack>
        </YStack>

        <YStack>
          <Text style={[styles.titleStyle, {color: theme.color12.val}]}>인기 글</Text>
          <YStack style={{flex:1}}>
            {popularPosts?.map((post) => (
              <TouchableOpacity onPress={() => router.push(`/(main)/(modals)/posts/${post.category}/${post.postId}`)} key={post.postId} style={[styles.postContainer, {backgroundColor: theme.color5.val}]}>
                <XStack style={{flex:1, justifyContent:'space-between'}}>

                  <YStack style={{flex:1, justifyContent:'space-between'}}>
                    <View>
                      {/* 포스트 제목 */}
                      <Text style={styles.postTitle}>{post.title}</Text> 
                      {/* 포스트 내용 */}
                      <Text style={styles.postContent}>{post.content.length > 20 ? post.content.slice(0,20)+ '...' : post.content}</Text>
                    </View>
                    <View>
                      <Text style={[styles.postCreatedAt, {color: theme.color10.val}]}>{format(post.createdAt, 'yyyy/MM/dd HH:mm')}</Text>
                    </View>
                  </YStack>

                  <YStack style={{justifyContent:'space-between', width:70, alignItems:'flex-end'}}>
                    {/* 카테고리 */}
                    <View style={[styles.categoryContainer, {backgroundColor: theme.color9.val}]}>
                      <Text style={{fontSize: 13,color: 'white'}}>{titleMap[post.category]}</Text>
                    </View>
                    <XStack>
                      <XStack style={{justifyContent:'center', alignItems:'center'}}>
                        <ThumbsUp color={'$accent1'} size={'$1'} marginEnd={2} /> 
                        <Text style={{fontSize:16, color:theme.color12.val}}>{post.likeCount}</Text>
                      </XStack>
                    </XStack>
                  </YStack>
                </XStack>
              </TouchableOpacity>
            ))}
          </YStack>
        </YStack>

        <YStack>
          <Text style={[styles.titleStyle, {color: theme.color12.val}]}>새로운 채팅방</Text>
            <YStack style={{flex:1}}>
              {newChatroom.map((chatroom)=> (
                <TouchableOpacity key={chatroom.chatroomId} onPress={() => handleChatroomAccess(chatroom.chatroomId)} style={[styles.chatroomContainer, {backgroundColor: theme.color3.val}]}>
                  <XStack style={{ padding:8}}>
                    <YStack style={{flex:1}}>
                      <Text style={[styles.chatroomTitle, {color: theme.color12.val}]}>{chatroom.title}</Text>
                      <Text style={{color: theme.color12.val}}>{chatroom.explain}</Text>
                      
                    </YStack>
                    <YStack style={{width:75, height:75}}>
                      <Image source={{uri: chatroom.imageURL}} style={{width:75, height:75, borderRadius:10}}/>
                    </YStack>
                  </XStack>
                </TouchableOpacity>
              ))}
            </YStack>
          <YStack>
          </YStack>
        </YStack>

        <YStack>
          <Text style={[styles.titleStyle, {color: theme.color12.val}]}>새로운 채팅방</Text>
            <YStack style={{flex:1}}>
              {newChatroom.map((chatroom)=> (
                <TouchableOpacity key={chatroom.chatroomId} onPress={() => handleChatroomAccess(chatroom.chatroomId)} style={[styles.chatroomContainer, {backgroundColor: theme.color3.val}]}>
                  <XStack style={{ padding:8}}>
                    <YStack style={{flex:1}}>
                      <Text style={[styles.chatroomTitle, {color: theme.color12.val}]}>{chatroom.title}</Text>
                      <Text style={{color: theme.color12.val}}>{chatroom.explain}</Text>
                      
                    </YStack>
                    <YStack style={{width:75, height:75}}>
                      <Image source={{uri: chatroom.imageURL}} style={{width:75, height:75, borderRadius:10}}/>
                    </YStack>
                  </XStack>
                </TouchableOpacity>
              ))}
            </YStack>
          <YStack>
          </YStack>
        </YStack>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width:60,
    height:50,
    
  },
  titleStyle: {
    padding:6,
    fontSize: 20, 
    fontWeight:'500'
  },
  postContainer: {
    height:90,
    borderRadius: 10,
    marginBottom:10,
    padding:10, 
    justifyContent: 'space-between'
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  postContent: {
    fontSize: 14,
    fontWeight: '500',
  },
  postCreatedAt: {
    fontSize: 10,
  },
  categoryContainer: {
    width: 60,
    height:20,
    alignItems:'center',
    justifyContent: 'center',
    borderRadius:9,
  },
  chatroomContainer: {
    height:90,
    marginBottom: 10,
    borderRadius:10,
    justifyContent:'center',
    padding: 6,
  },
  chatroomTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  chatroomExplain: {
    fontSize:14,
    fontWeight:'500',
  },
  todoButton: {
    width:83, 
    height: 20, 
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius:10,
    elevation:4, 
    shadowColor:'#000', 
    shadowOffset:{width:0, height:2}, 
    shadowOpacity:0.2, 
    shadowRadius:3, 
    flexDirection:'row'
  }
})
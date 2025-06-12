import { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
import { Button, useTheme, Popover, YStack} from "tamagui";
import { EllipsisVertical, Siren, Trash2 } from '@tamagui/lucide-icons';
import { deletePost } from "@/firebase/posts";
import { useRouter } from "expo-router";


type DropDownMenuProps = {
  postId: string;
  postUserUID: string|undefined;
  userUID: string|null|undefined;
  category: string;
}
// 게시글 상세 스크린 헤더 버튼 (글 삭제, 글 신고)
export const PostDropDownMenu = ({postId, postUserUID, userUID, category}: DropDownMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false); // 메뉴의 가시성을 관리
  const theme = useTheme();
  const router = useRouter();
  // 메뉴 열기/닫기 토글 함수
  const toggleMenu = () => {
    setMenuVisible(prev => !prev)
    console.log("토글 클릭");
  };
  // 게시글 삭제 함수
  const handleDeletePost = async () => {
    const getPostId = postId;
    console.log("getPostId", getPostId);
    deletePost(postId);
    
    setMenuVisible(false);
    
    router.replace(`/(main)/(modals)/posts/${category}`);

  }
  // 게시글 신고 함수
  const handleReportPost = () => {
    setMenuVisible(false);
    console.log("postId menu", postId);
  }

  return (
    <View>
      {/* 오른쪽 상단 버튼 */}
      <TouchableOpacity onPress={toggleMenu} style={{ padding: 8 }}>
        <EllipsisVertical size={24} color={'$color12'}/>
      </TouchableOpacity>

      {/* 드롭다운 메뉴 */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* 회색 배경 눌렀을 때 닫히게 */}
          <Pressable
            style={StyleSheet.absoluteFillObject} 
            onPress={() => setMenuVisible(false)}
          />

          {/* 메뉴 박스 */}
          <View style={[styles.menuContainer, {backgroundColor: theme.color3?.val}]}>
            {userUID === postUserUID && (
              <TouchableOpacity style={styles.menuItem} onPress={handleDeletePost}>
                <View style={styles.menuTitle}>
                  <Trash2 size={20} marginRight={8}/>
                  <Text style={{color: theme.color12?.val}}>글 삭제</Text>
                </View>
              </TouchableOpacity>
            )} 

            {userUID !== postUserUID && (
              <TouchableOpacity style={styles.menuItem} onPress={handleReportPost}>
                <View style={styles.menuTitle}>
                  <Siren size={20} marginRight={8}/>
                  <Text style={{color: theme.color12?.val}}>신고</Text>
                </View>
              </TouchableOpacity>
            )}

            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 15 : -40, // 버튼 아래 위치 조정
    paddingRight: 10,

  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 96 : 45, // 버튼 바로 아래
    right: Platform.OS === 'ios' ? 19 : 18, // 버튼 바로 아래
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 5, // 안드로이드 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuTitle: {
    display: "flex", 
    flexDirection:"row", 
    alignItems:"center"
  }
});

export default PostDropDownMenu;

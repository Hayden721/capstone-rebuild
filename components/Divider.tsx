
import { View, StyleSheet } from "react-native"

const Divider: React.FC = () => {
  return <View style={Style.divider}/>
  
}

const Style = StyleSheet.create({
  divider: {
    borderBottomColor:'#ccc', // 선 색상
    borderBottomWidth: 1, // 선 굵기
    marginVertical: 10 // 위 아래 간격
  }
})

export default Divider;
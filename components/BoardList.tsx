import { BookText } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ComponentType } from "react";
import { Pressable } from "react-native";
import { Button, Text, XStack } from "tamagui";

// 게시판 리스트

type screenPath = `/(modals)/posts/${string}`;

interface BoardListProps {
  label: string;
  screen: screenPath;
  icon: ComponentType<{ size?: number; }>;
}

export default function BoardList({label, screen, icon: Icon }: BoardListProps) {
const router = useRouter();

  return (
    <Pressable onPress={() => router.push(screen)}>
      <XStack style={{alignItems: 'center', paddingVertical: 6}}>
        <Icon size={17} />
        <Text fontSize={17} style={{marginLeft: 10}}>{label}</Text>
      </XStack>
    </Pressable>
    
    
  )
}
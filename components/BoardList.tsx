import { BookText } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ComponentType } from "react";
import { Pressable } from "react-native";
import { Button, Text, XStack } from "tamagui";

type screenPath = `/(main)/${string}`  | `/(stack)/major/${string}`;

interface BoardListProps {
  label: string;
  screen: screenPath;
  icon: ComponentType<{ size?: number; }>;
}

export default function BoardList({label, screen, icon: Icon }: BoardListProps) {
const router = useRouter();

  return (
    <Pressable onPress={() => router.push(screen)}>
      <XStack alignItems="center" paddingVertical="$2.5">
        <Icon size={17} />
        <Text fontSize={17} marginLeft="$2">{label}</Text>
      </XStack>
    </Pressable>
    
    
  )
}
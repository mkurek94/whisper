import ChatItem from "@/components/ChatItem";
import EmptyState from "@/components/EmptyState";
import { useChats } from "@/hooks/useChats";
import { Chat } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatsTab = () => {
  const { data: chats, isLoading, error } = useChats();
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeAreaView className="bg-surface flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={"#F4A261"} />
        <Text className="text-white text-4xl">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-surface flex-1 items-center justify-center">
        <Text className="text-white text-4xl">Failed to load chats</Text>
      </SafeAreaView>
    );
  }

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: chat._id,
        participantId: chat.participant._id,
        name: chat.participant.name,
        avatar: chat.participant.avatar,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <FlatList
        data={chats}
        keyExtractor={(chat) => chat._id}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => handleChatPress(item)} />
        )}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
          <EmptyState
            title="No chats found"
            subtitle="Start a conversation!"
            buttonLabel="New Chat"
            onPressButton={() => router.push("/new-chat")}
          />
        }
      />
    </SafeAreaView>
  );
};

export default ChatsTab;

const Header = () => {
  const router = useRouter();
  return (
    <View className="px-5 pt-2 pb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Chats</Text>
        <Pressable
          className="size-10 bg-primary rounded-full items-center justify-center"
          onPress={() => router.push("/new-chat")}
        >
          <Ionicons name="create-outline" size={20} color="#0D0D0F" />
        </Pressable>
      </View>
    </View>
  );
};

import { View, Text, Pressable } from "react-native";
import React from "react";
import { Chat } from "@/types";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ chat, onPress }: { chat: Chat; onPress: () => void }) => {
  const participant = chat.participant;

  const isOnline = true;
  const isTyping = false;
  const hasUnread = false;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 py-3 active:opacity-70"
    >
      {/* Avatar */}
      <View className="relative">
        <Image
          source={{ uri: participant.avatar }}
          style={{ width: 56, height: 56, borderRadius: 999 }}
          contentFit="cover"
        />
        {isOnline && (
          <View className="absolute bottom-0 right-0 size-4 rounded-full bg-green-500 border-[3px] border-surface" />
        )}
      </View>

      {/* Chat info */}
      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-base font-medium ${hasUnread ? "text-primary" : "text-foreground"}`}
          >
            {participant.name}
          </Text>

          <View className="flex-row items-center gap-2">
            {hasUnread && <View className="size-2.5 rounded-full bg-primary" />}
            <Text className="text-xs text-subtle-foreground">
              {chat.lastMessageAt
                ? formatDistanceToNow(new Date(chat.lastMessageAt), {
                    addSuffix: false,
                  })
                : ""}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          {isTyping ? (
            <Text className="text-xs text-primary italic">Typing...</Text>
          ) : (
            <Text
              className={`text-sm flex-1 mr-3 ${hasUnread ? "text-subtle-foreground font-medium" : "text-subtle-foreground"}`}
              numberOfLines={1}
            >
              {chat.lastMessage?.text || "No messages yet"}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;

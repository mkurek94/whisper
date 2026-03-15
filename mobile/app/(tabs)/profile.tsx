import { Pressable, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";

const ProfileTab = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="bg-surface flex-1">
      <Text className="text-white text-4xl">Profile Tab</Text>
      <Pressable onPress={() => signOut()}>
        <Text className="text-white text-lg">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileTab;

import { View, Text, Dimensions, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedOrb } from "@/components/AnimatedOrb";
import {BlurView} from "expo-blur";

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const { width, height } = Dimensions.get("window");
  const isLoading = loadingStrategy !== null;
  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden">
        <LinearGradient
          colors={["#0D0D0F", "#1a1a2E", "#16213E", "#0D0D0F"]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <AnimatedOrb
          colors={["#F4A261", "#E76F51"]}
          size={300}
          initialX={-80}
          initialY={height * 0.1}
          duration={4000}
        />

        <AnimatedOrb
          colors={["#E76F51", "#F4A261"]}
          size={250}
          initialX={width - 100}
          initialY={height * 0.3}
          duration={5000}
        />

        <AnimatedOrb
          colors={["#FFD7BA", "#F4A261"]}
          size={200}
          initialX={width * 0.3}
          initialY={height * 0.6}
          duration={3500}
        />

        <AnimatedOrb
          colors={["#F4B183", "#E76F51"]}
          size={180}
          initialX={-50}
          initialY={height * 0.75}
          duration={4500}
        />

        <BlurView
          intensity={70}
          tint="dark"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      </View>
      <SafeAreaView className="flex-1">
        <View className="items-center pt-10">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 100, height: 100, marginVertical: -20 }}
            contentFit="contain"
          />
          <Text className="w-full text-center text-4xl font-bold text-primary font-serif tracking-wider uppercase">
            Whisper
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Image
            source={require("@/assets/images/auth.png")}
            style={{ width: width - 48, height: height * 0.3 }}
            contentFit="contain"
          />

          <View className="mt-6 items-center">
            <Text className="text-5xl font-bold text-foreground text-center font-sans">
              Connect & Chat
            </Text>
            <Text className="text-3xl font-bold text-primary">Seamlessly</Text>
          </View>

          <View className="flex-row gap-4 mt-10">
            <Pressable
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              onPress={() => !isLoading && handleSocialAuth("oauth_google")}
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/95 py-4 rounded-2xl active:scale-[0.97]"
            >
              <Image
                source={require("@/assets/images/google.png")}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
              <Text className="text-gray-900 font-semibold text-sm">
                Google
              </Text>
            </Pressable>
            <Pressable
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl active:scale-[0.97]"
            >
              <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
              <Text className="text-foreground font-semibold text-sm">
                Apple
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;

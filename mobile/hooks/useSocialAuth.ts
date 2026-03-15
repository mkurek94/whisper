import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

export const useSocialAuth = () => {
  const { startSSOFlow } = useSSO();
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    if (loadingStrategy) return;
    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });

      if (!createdSessionId || !setActive) {
        const provider = strategy === "oauth_google" ? "Google" : "Apple";
        Alert.alert(
          "Sign-in incomplete",
          `${provider} sign-in did not complete. Please try again.`,
        );
        return;
      }

      await setActive({ session: createdSessionId, redirectUrl: "/(tabs)" });
    } catch (error) {
      console.log("Error in social auth:", error);
      Alert.alert(
        "Error",
        `Failed to initiate social authentication with ${strategy}.`,
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

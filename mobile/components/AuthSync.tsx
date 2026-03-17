import { useAuthCallback } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/expo";
import * as Sentry from "@sentry/react-native";

const AuthSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();
  const hasSyncedRef = useRef(false); //this is to used to not run useEffect more then once

  useEffect(() => {
    if (isSignedIn && user && !hasSyncedRef.current) {
      syncUser(undefined, {
        onSuccess: (res) => {
          console.log("User synced successfully:", res.name);
          Sentry.logger.info(
            Sentry.logger.fmt`User synced with backend: ${res.name}`,
            {
              userId: user?.id,
              userName: res.name,
            },
          );
        },
        onError: (error) => {
          console.error("Error syncing user:", error.message);
          Sentry.logger.error(
            Sentry.logger.fmt`Error syncing user: ${error.message}`,
            {
              userId: user?.id,
              error: error instanceof Error ? error.message : String(error),
            },
          );
        },
      });
      hasSyncedRef.current = true;
    }

    if (!isSignedIn) {
      hasSyncedRef.current = false;
    }
  }, [isSignedIn, user, syncUser]);
  return null;
};

export default AuthSync;

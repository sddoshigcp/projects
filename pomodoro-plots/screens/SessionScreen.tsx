import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  AppState,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";

const SessionScreen = ({ route, navigation }) => {
  const { sessionLength, sessionId } = route.params;
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(true);
  const navigatedAway = useRef(false);
  const isRunningRef = useRef(isRunning); // Ref to track isRunning state

  useEffect(() => {
    isRunningRef.current = isRunning; // Keep the ref updated
  }, [isRunning]);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer); // Stop the timer when time reaches 0
            endSession("Completed");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup timer on unmount or pause
  }, [isRunning]);

  useEffect(() => {
    if (Platform.OS === "web") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      AppState.addEventListener("change", handleAppStateChange);
    }

    return () => cleanupListeners();
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (navigatedAway.current) return;
    if (nextAppState === "background" || nextAppState === "inactive") {
      endSession("Terminated (Focus Lost)");
    }
  };

  const handleVisibilityChange = () => {
    if (navigatedAway.current) return;
    if (document.visibilityState === "hidden") {
      endSession("Terminated (Focus Lost)");
    }
  };

  const cleanupListeners = () => {
    if (Platform.OS === "web") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    } else {
      AppState.removeEventListener("change", handleAppStateChange);
    }
  };

  const endSession = async (reason: string) => {
    if (navigatedAway.current) return;
    setIsRunning(false);
    navigatedAway.current = true;

    await supabase
      .from("sessions")
      .update({
        updated_at: new Date().toISOString(),
        end_time: new Date().toISOString(),
        session_status: reason,
      })
      .eq("session_id", sessionId);

    cleanupListeners();
    navigation.navigate("SessionResults", { sessionId });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View>
      <Text>Session Screen</Text>
      <Text>Time Left: {formatTime(timeLeft)}</Text>
      <Button
        title={isRunning ? "Pause" : "Play"}
        onPress={() => setIsRunning((prevState) => !prevState)}
      />
      <Button title="End Session" onPress={() => endSession("Terminated (Manually)")} />
    </View>
  );
};

export default SessionScreen;

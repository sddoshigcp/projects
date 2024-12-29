import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  AppState,
  AppStateStatus,
  Platform,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";

const SessionScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { sessionLength, sessionId } = route.params; // Retrieve sessionId and sessionLength from route params
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(true); // Timer is running initially
  const [startTime] = useState(new Date()); // Session start time
  const [endedAutomatically, setEndedAutomatically] = useState(false); // Track session end type
  const [endedDueToFocusLoss, setEndedDueToFocusLoss] = useState(false); // Track focus loss end

  // Function to update session in the database
  const updateSession = async (updates: any) => {
    try {
      const { error } = await supabase
        .from("sessions")
        .update(updates)
        .eq("session_id", sessionId);

      if (error) {
        console.error("Error updating session:", error);
        Alert.alert("Error", "Failed to update session data.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred while updating.");
    }
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      // Update session's `updated_at` field periodically
      updateSession({ updated_at: new Date().toISOString() });
    } else {
      clearInterval(timer);
    }

    // Navigate to results screen when timer reaches zero
    if (timeLeft === 0) {
      setEndedAutomatically(true);
      updateSession({
        updated_at: new Date().toISOString(),
        end_time: new Date().toISOString(),
        session_status: "Complete",
      });
      navigation.navigate("SessionResults", {
        sessionLength,
        startTime,
        endTime: new Date(),
        endedAutomatically: true,
        endedDueToFocusLoss: false,
      });
    }

    return () => clearInterval(timer); // Cleanup interval on unmount or when isRunning changes
  }, [isRunning, timeLeft]);

  // Handle focus/blur events
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        setEndedDueToFocusLoss(true);
        endSession(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setEndedDueToFocusLoss(true);
        endSession(true);
      }
    };

    // Add listeners
    if (Platform.OS === "web") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      AppState.addEventListener("change", handleAppStateChange);
    }

    // Cleanup listeners
    return () => {
      if (Platform.OS === "web") {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      } else {
        AppState.removeEventListener("change", handleAppStateChange);
      }
    };
  }, []);

  // End session and navigate to results screen
  const endSession = async (dueToFocusLoss: boolean = false) => {
    await updateSession({
      updated_at: new Date().toISOString(),
      end_time: new Date().toISOString(),
      session_status: "Terminated",
    });

    navigation.navigate("SessionResults", {
      sessionLength,
      startTime,
      endTime: new Date(),
      endedAutomatically: false, // Not completed if terminated manually or via focus change
      endedDueToFocusLoss: dueToFocusLoss,
    });
  };

  // Convert timeLeft to MM:SS format
  const formatTime = (seconds: number) => {
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
        onPress={() => {
          setIsRunning((prevState) => !prevState);
        }}
      />
      <Button title="End Session" onPress={() => endSession(false)} />
    </View>
  );
};

export default SessionScreen;

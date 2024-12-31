import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Button, AppState, Platform } from "react-native";
import { supabase } from "../../lib/supabase";

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
    const appStateListener = AppState.addEventListener("change", handleAppStateChange);

    // Clean up listeners on unmount or when navigating away
    return () => {
      if (appStateListener) {
        appStateListener.remove();
      }
      cleanupListeners();
    };
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
    }
  };

  const endSession = async (reason) => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>
      <Text style={styles.time}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title={isRunning ? "Pause" : "Play"}
            onPress={() => setIsRunning((prevState) => !prevState)}
            color="#6200EE"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="End Session"
            onPress={() => endSession("Terminated (Manually)")}
            color="#6200EE"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonWrapper: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default SessionScreen;

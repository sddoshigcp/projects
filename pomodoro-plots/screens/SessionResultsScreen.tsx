import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import { supabase } from "../lib/supabase";

const SessionResultsScreen = ({ route, navigation }) => {
  const { sessionId } = route.params;
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("session_id", sessionId)
          .single();

        if (error) {
          console.error("Error fetching session details:", error);
          Alert.alert("Error", "Failed to fetch session details.");
        } else {
          setSessionDetails(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching session details:", err);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (!sessionDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading session details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Results</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Start Time:</Text>
          <Text style={styles.value}>
            {new Date(sessionDetails.start_time).toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>End Time:</Text>
          <Text style={styles.value}>
            {new Date(sessionDetails.end_time).toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Session Length:</Text>
          <Text style={styles.value}>
            {sessionDetails.session_length} minutes
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Session Status:</Text>
          <Text style={styles.value}>{sessionDetails.session_status}</Text>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="Return Home"
          onPress={() => navigation.navigate("Home")}
          color="#6200EE"
        />
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
  detailsContainer: {
    marginBottom: 40,
    alignItems: "center", // Center the details block on the screen
  },
  detailRow: {
    flexDirection: "row",
    width: "100%", // Ensures rows span the container's width
    justifyContent: "center", // Centers the content block horizontally
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1, // Labels take up equal space and align left
    textAlign: "right",
    paddingRight: 10, // Space between label and value
    color: "#333",
  },
  value: {
    fontSize: 16,
    flex: 1, // Values take more space and align left
    textAlign: "left",
    color: "#333",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default SessionResultsScreen;

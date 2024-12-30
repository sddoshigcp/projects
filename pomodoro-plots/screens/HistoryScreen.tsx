import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../lib/supabase";

const HistoryScreen = ({ navigation }: { navigation: any }) => {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await fetchSessions();
      if (data) {
        setSessions(data);
      }
    };
    loadSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase.from("sessions").select();
    if (error) {
      console.error("Error fetching sessions:", error);
      return null;
    }
    return data || [];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session History</Text>
      {sessions.length > 0 ? (
        <ScrollView style={styles.sessionsContainer}>
          {sessions.map((session, index) => (
            <View key={index} style={styles.sessionItem}>
              <Text style={styles.sessionHeader}>Date: {new Date(session.start_time).toLocaleDateString()}</Text>
              <Text style={styles.sessionText}>Start Time: {new Date(session.start_time).toLocaleTimeString()}</Text>
              <Text style={styles.sessionText}>End Time: {new Date(session.end_time).toLocaleTimeString()}</Text>
              <Text style={styles.sessionText}>Session Length: {session.session_length} minutes</Text>
              <Text style={styles.sessionText}>Session Status: {session.session_status}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noSessionsText}>No sessions available.</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Return Home" onPress={() => navigation.navigate("Home")} color="#6200EE" />
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
  sessionsContainer: {
    marginBottom: 20,
  },
  sessionItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sessionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  sessionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  noSessionsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default HistoryScreen;

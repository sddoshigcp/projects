import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

const HistoryScreen = ({ navigation }: { navigation: any }) => {
  const [sessions, setSessions] = useState<any[]>([]); // Ensure it's initialized as an array

  useEffect(() => {
    const loadSessions = async () => {
      const data = await fetchSessions(); // Await the fetchSessions function
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
    return data || []; // Ensure it returns an array
  };

  return (
    <View>
      <Text>History Screen</Text>
      {sessions.length > 0 ? (
        sessions.map((session, index) => (
          <View key={index}>
            <Text>Start Time: {session.start_time}</Text>
            <Text>End Time: {session.end_time}</Text>
            <Text>Session Length: {session.session_length}</Text>
            <Text>Session Status: {session.session_status}</Text>
          </View>
        ))
      ) : (
        <Text>No sessions available.</Text>
      )}
      <Button title="Return Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};


export default HistoryScreen;

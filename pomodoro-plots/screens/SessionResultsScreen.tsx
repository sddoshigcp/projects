import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
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
      <View>
        <Text>Loading session details...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Session Results</Text>
      <Text>Start Time: {new Date(sessionDetails.start_time).toLocaleTimeString()}</Text>
      <Text>End Time: {new Date(sessionDetails.end_time).toLocaleTimeString()}</Text>
      <Text>Session Length: {sessionDetails.session_length} minutes</Text>
      <Text>Session Status: {sessionDetails.session_status}</Text>
      <Button title="Return Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

export default SessionResultsScreen;

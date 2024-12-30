import React, { useState } from "react";
import { View, Text, Button, Picker, Alert } from "react-native";
import { supabase } from "../lib/supabase";

const SessionSetupScreen = ({ navigation }: { navigation: any }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(15);

  // Generate options for the dropdown (15 min to 120 min)
  const minuteOptions = Array.from({ length: 8 }, (_, i) => (i + 1) * 15);
  minuteOptions.push(0.1);
  minuteOptions.push(1);

  const handleStartTimer = async () => {
    try {
      // Assuming you have user authentication set up and can retrieve the user ID
      const user = supabase.auth.getUser();
      if (!user) {
        alert("Error: User not logged in");
        return;
      }

      const userId = (await user).data.user?.id

      console.log("userId: ", userId)

      const { data, error } = await supabase
        .from("sessions")
        .insert([
          {
            user_id: userId,
            start_time: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            session_length: selectedMinutes,
          },
        ])
        .select("session_id")
        .single();

      if (error) {
        console.error("Error inserting session:", error);
        alert("Error: Failed to create a session.");
        return;
      }

      // Navigate to the session screen with session details
      navigation.navigate("Session", {
        sessionLength: selectedMinutes,
        sessionId: data.session_id,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Error: An unexpected error occurred.");
    }
  };

  return (
    <View>
      <Text>Session Setup Screen</Text>
      <Text>Select Session Length:</Text>
      <Picker
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
      >
        {minuteOptions.map((minutes) => (
          <Picker.Item
            key={minutes}
            label={`${minutes} minutes`}
            value={minutes}
          />
        ))}
      </Picker>
      <Button title="Start Timer" onPress={handleStartTimer} />
    </View>
  );
};

export default SessionSetupScreen;

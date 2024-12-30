import React, { useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Dropdown } from "react-native-element-dropdown";

const SessionSetupScreen = ({ navigation }: { navigation: any }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);

  // Generate options for the dropdown (15 min to 120 min)
  const minuteOptions = Array.from({ length: 8 }, (_, i) => ({
    label: `${(i + 1) * 15} minutes`,
    value: (i + 1) * 15,
  }));
  minuteOptions.push({ label: "0.1 minutes", value: 0.1 });
  minuteOptions.push({ label: "1 minute", value: 1 });

  const handleStartTimer = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user) {
        alert("Error: User not logged in");
        return;
      }

      const userId = user.data.user?.id;

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
    <View style={styles.container}>
      <Text style={styles.title}>Session Setup Screen</Text>
      <Text style={styles.label}>Select Session Length:</Text>
      <Dropdown
        style={[styles.dropdown, isDropdownFocused && styles.dropdownFocused]}
        data={minuteOptions}
        labelField="label"
        valueField="value"
        placeholder="Select minutes"
        value={selectedMinutes}
        onFocus={() => setIsDropdownFocused(true)}
        onBlur={() => setIsDropdownFocused(false)}
        onChange={(item) => setSelectedMinutes(item.value)}
      />
      <View style={styles.buttonWrapper}>
        <Button title="Start Timer" onPress={handleStartTimer} />
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
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  dropdownFocused: {
    borderColor: "#6200EE",
  },
  buttonWrapper: {
    backgroundColor: "#6200EE",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default SessionSetupScreen;

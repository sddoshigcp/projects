import React, { useState } from "react";
import { StyleSheet, View, Text, Button, Alert, TextInput } from "react-native";
import { supabase } from "../../lib/supabase";
import { Dropdown } from "react-native-element-dropdown";

const CreateExerciseScreen = ({ navigation }: { navigation: any }) => {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseCategory, setExerciseCategory] = useState("");
  const exerciseCategories = ["Resistance", "Cardio", "Assisted", "Body Weight"];

  const handleCreateExercise = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      alert("Error: User not logged in");
      return;
    }
    const userId = user.data.user?.id;

    if (!exerciseName.trim()) {
      Alert.alert("Error", "Please enter an exercise name.");
      return;
    }

    if (!exerciseCategory) {
      Alert.alert("Error", "Please select an exercise category.");
      return;
    }

    try {
      // Insert the new custom exercise into the database
      const { data, error } = await supabase.from("custom_exercises").insert([
        {
          name: exerciseName,
          exercise_category: exerciseCategory,
          user_id: userId, // Replace with dynamic user ID if available
        },
      ]);

      if (error) {
        console.error("Error creating exercise:", error);
        Alert.alert("Error", "Failed to create exercise. Please try again.");
      } else {
        Alert.alert("Success", "Exercise created successfully!");
        setExerciseName(""); // Reset the input field
        navigation.goBack(); // Navigate back after creating the exercise
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Custom Exercise</Text>
      <Text style={styles.label}>Enter Exercise Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Bench Press"
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <Text style={styles.label}>Enter Exercise Type:</Text>
      <Dropdown
        style={styles.dropdown}
        data={exerciseCategories.map((e) => ({
          label: e,
          value: e,
        }))}
        value={exerciseCategory}
        labelField="label"
        valueField="value"
        onChange={(item) => setExerciseCategory(item.value)}
        placeholder="Select a Category"
      />
      <View style={styles.buttonWrapper}>
        <Button title="Create Exercise" onPress={handleCreateExercise} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: { height: 50, marginBottom: 20 },
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
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  buttonWrapper: {
    backgroundColor: "#6200EE",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default CreateExerciseScreen;

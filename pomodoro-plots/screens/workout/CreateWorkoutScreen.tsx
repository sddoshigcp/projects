import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";
import { Dropdown } from "react-native-element-dropdown";
import DraggableFlatList from "react-native-draggable-flatlist";
import { FontAwesome } from "@expo/vector-icons"; // If using Expo for icons

const CreateWorkoutScreen = ({ navigation }: { navigation: any }) => {
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const user = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userId = user.data.user?.id;

      // Fetch custom exercises
      const { data: customExercises, error: customError } = await supabase
        .from("custom_exercises")
        .select("*")
        .eq("user_id", userId);

      // Fetch default exercises
      const { data: defaultExercises, error: defaultError } = await supabase
        .from("default_exercises")
        .select("*");

      if (customError || defaultError) {
        console.error("Error fetching exercises:", customError || defaultError);
        Alert.alert("Error", "Failed to fetch exercises.");
        return;
      }

      setAllExercises([
        ...(customExercises || []).map((e) => ({ ...e, type: "custom" })),
        ...(defaultExercises || []).map((e) => ({ ...e, type: "default" })),
      ]);
    };

    fetchExercises();
  }, []);

  const handleAddExercise = () => {
    if (!selectedExerciseId) {
      Alert.alert("Error", "Please select an exercise.");
      return;
    }

    const selectedExercise = allExercises.find(
      (e) => e.id === selectedExerciseId
    );
    if (!selectedExercise) return;

    setWorkoutExercises((prev) => [...prev, { ...selectedExercise }]);
    setSelectedExerciseId(null); // Reset dropdown
  };

  const handleRemoveExercise = (index) => {
    setWorkoutExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveWorkout = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }
    const userId = user.data.user?.id;

    try {
      const { data, error } = await supabase.from("workouts").insert({
        user_id: userId,
        exercises: workoutExercises.map((e) => ({
          exercise_id: e.id,
          type: e.type,
        })),
      });

      if (error) throw error;

      Alert.alert("Success", "Workout saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Error", "Failed to save workout.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Workout</Text>

      <Dropdown
        style={styles.dropdown}
        data={allExercises.map((e) => ({ label: e.name, value: e.id }))}
        labelField="label"
        valueField="value"
        value={selectedExerciseId}
        onChange={(item) => setSelectedExerciseId(item.value)}
        placeholder="Select an Exercise"
      />

      <TouchableOpacity
        onPress={handleAddExercise}
        style={styles.buttonWrapper}
      >
        <Text style={{ color: "#FFF", padding: 10 }}>Add Exercise</Text>
      </TouchableOpacity>

      <DraggableFlatList
        data={workoutExercises}
        renderItem={({ item, index, drag, isActive }) => (
          <TouchableOpacity
            style={[
              styles.exerciseItem,
              isActive ? { backgroundColor: "#E0E0E0" } : {},
            ]}
            onLongPress={drag}
          >
            <Text style={styles.exerciseText}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
              <FontAwesome name="times" size={20} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={({ data }) => setWorkoutExercises(data)}
      />

      <TouchableOpacity
        onPress={handleSaveWorkout}
        style={styles.buttonWrapper}
      >
        <Text style={{ color: "#FFF", padding: 10 }}>Save Workout</Text>
      </TouchableOpacity>
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
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  exerciseList: {
    flex: 1,
    marginVertical: 20,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  exerciseText: {
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  buttonWrapper: {
    backgroundColor: "#6200EE",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 20,
  },
});

export default CreateWorkoutScreen;

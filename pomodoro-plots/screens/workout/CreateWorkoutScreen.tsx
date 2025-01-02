import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { Dropdown } from "react-native-element-dropdown";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { DroppableColumn } from "../../components/DroppableColumn";

type Exercise = {
  id: string;
  name: string;
  type: string;
  order: number;
};

const CreateWorkoutScreen = ({ navigation }: { navigation: any }) => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const user = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userId = user.data.user?.id;

      const { data: customExercises, error: customError } = await supabase
        .from("custom_exercises")
        .select("*")
        .eq("user_id", userId);

      const { data: defaultExercises, error: defaultError } = await supabase
        .from("default_exercises")
        .select("*");

      if (customError || defaultError) {
        Alert.alert("Error", "Failed to fetch exercises.");
        return;
      }

      setAllExercises([
        ...(customExercises || []).map((e) => ({ ...e, type: "custom", order: -1 })),
        ...(defaultExercises || []).map((e) => ({ ...e, type: "default", order: -1 })),
      ]);
    };

    fetchExercises();
  }, []);

  const handleAddExercise = () => {
    if (!selectedExerciseId) {
      Alert.alert("Error", "Please select an exercise.");
      return;
    }

    const selectedExercise = allExercises.find((e) => e.id === selectedExerciseId);
    if (!selectedExercise) return;

    setWorkoutExercises((prev) => [
      ...prev,
      { ...selectedExercise, order: prev.length },
    ]);
    setSelectedExerciseId(null);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = workoutExercises.findIndex((e) => e.id === active.id);
    const newIndex = workoutExercises.findIndex((e) => e.id === over.id);

    const reordered = arrayMove(workoutExercises, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        order: index,
      })
    );

    setWorkoutExercises(reordered);
  };

  const handleSaveWorkout = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    const userId = user.data.user?.id;

    try {
      const { error } = await supabase.from("workouts").insert({
        user_id: userId,
        exercises: workoutExercises.map((e) => ({
          exercise_id: e.id,
          type: e.type,
          order: e.order,
        })),
      });

      if (error) throw error;

      Alert.alert("Success", "Workout saved successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save workout.");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Create Workout</Text>

      <Dropdown
        style={styles.dropdown}
        data={allExercises.map((e) => ({ label: e.name, value: e.id }))}
        labelField="label"
        valueField="value"
        value={selectedExerciseId}
        onChange={(item) => setSelectedExerciseId(item.value)}
        placeholder="Select an Exercise"
      />

      <TouchableOpacity onPress={handleAddExercise} style={styles.buttonWrapper}>
        <Text style={{ color: "#FFF", padding: 10 }}>Add Exercise</Text>
      </TouchableOpacity>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workoutExercises.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <DroppableColumn items={workoutExercises} />
        </SortableContext>
      </DndContext>

      <TouchableOpacity onPress={handleSaveWorkout} style={styles.buttonWrapper}>
        <Text style={{ color: "#FFF", padding: 10 }}>Save Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={console.log("allExercises: ", allExercises)}></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  name: { fontSize: 24, marginBottom: 20 },
  dropdown: { height: 50, marginBottom: 20 },
  buttonWrapper: { backgroundColor: "#6200EE", padding: 10, marginTop: 20 },
});

export default CreateWorkoutScreen;

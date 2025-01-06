import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
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
import { MeasuringStrategy } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { DroppableColumn } from "../../components/DroppableColumn";
import { TextInput } from "react-native-gesture-handler";

type Exercise = {
  id: string;
  name: string;
  type: string;
  order: number;
};

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const EditWorkoutScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { workoutId } = route.params;
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      const user = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userId = user.data.user?.id;

      const { data: workout, error: workoutError } = await supabase
        .from("created_workouts")
        .select("id, name, workout_exercises (default_exercise_id, custom_exercise_id, exercise_type, exercise_name, position)")
        .eq("id", workoutId)
        .single();

      if (workoutError || !workout) {
        Alert.alert("Error", "Failed to load workout details.");
        return;
      }

      setWorkoutName(workout.name);

      const exercises = (workout.workout_exercises || []).map((e: any) => ({
        id: e.exercise_type === "default" ? e.default_exercise_id : e.custom_exercise_id,
        name: e.exercise_name,
        type: e.exercise_type,
        order: e.position,
      }));

      setWorkoutExercises(exercises);

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
        ...(customExercises || []).map((e) => ({
          ...e,
          type: "custom",
          order: -1,
        })),
        ...(defaultExercises || []).map((e) => ({
          ...e,
          type: "default",
          order: -1,
        })),
      ]);
    };

    fetchWorkoutDetails();
  }, [workoutId]);

  const handleAddExercise = (exerciseId: string) => {
    const selectedExercise = allExercises.find((e) => e.id === exerciseId);
    if (!selectedExercise) return;

    setWorkoutExercises((prev) => [
      ...prev,
      { ...selectedExercise, order: prev.length },
    ]);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setWorkoutExercises((prev) =>
      prev.filter((exercise) => exercise.id !== exerciseId)
    );
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
      // Step 1: Update workout name
      const { error: workoutError } = await supabase
        .from("created_workouts")
        .update({ name: workoutName })
        .eq("id", workoutId);

      if (workoutError) {
        throw workoutError;
      }

      // Step 2: Update exercises
      await supabase
        .from("workout_exercises")
        .delete()
        .eq("created_workout_id", workoutId);

      const exercisesToInsert = workoutExercises.map((e, index) => ({
        created_at: new Date().toISOString(),
        created_workout_id: workoutId,
        default_exercise_id: e.type === "default" ? e.id : null,
        custom_exercise_id: e.type === "custom" ? e.id : null,
        exercise_type: e.type,
        position: index,
        user_id: userId,
        exercise_name: e.name,
      }));

      const { error: exercisesError } = await supabase
        .from("workout_exercises")
        .insert(exercisesToInsert);

      if (exercisesError) {
        throw exercisesError;
      }

      Alert.alert("Success", "Workout updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update workout.");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Edit Workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <Dropdown
        style={styles.dropdown}
        data={allExercises.map((e) => ({
          label: e.name + " (" + e.type + ")",
          value: e.id,
        }))}
        labelField="label"
        valueField="value"
        onChange={(item) => handleAddExercise(item.value)}
        placeholder="Select an Exercise"
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        measuring={measuringConfig}
      >
        <SortableContext
          items={workoutExercises.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <DroppableColumn
            items={workoutExercises}
            onRemoveItem={handleRemoveExercise}
          />
        </SortableContext>
      </DndContext>

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
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  name: { fontSize: 24, marginBottom: 20 },
  dropdown: { height: 50, marginBottom: 20 },
  buttonWrapper: { backgroundColor: "#6200EE", padding: 10, marginTop: 20 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
});

export default EditWorkoutScreen;

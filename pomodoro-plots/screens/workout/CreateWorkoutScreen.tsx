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

const CreateWorkoutScreen = ({ navigation }: { navigation: any }) => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");

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

    fetchExercises();
  }, []);

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

  // const handleSaveWorkout = async () => {
  //   const user = await supabase.auth.getUser();
  //   if (!user) {
  //     Alert.alert("Error", "User not logged in");
  //     return;
  //   }

  //   const userId = user.data.user?.id;

  //   try {
  //     const { error } = await supabase.from("created_workouts").insert({
  //       user_id: userId,
  //       exercises: workoutExercises.map((e) => ({
  //         exercise_id: e.id,
  //         type: e.type,
  //         order: e.order,
  //       })),
  //     });

  //     if (error) throw error;

  //     Alert.alert("Success", "Workout saved successfully!");
  //     navigation.goBack();
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to save workout.");
  //   }
  // };

  const handleSaveWorkout = async () => {
    const user = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    const userId = user.data.user?.id;

    try {
      // Step 1: Insert into created_workouts
      const { data: createdWorkout, error: workoutError } = await supabase
        .from("created_workouts")
        .insert({
          user_id: userId,
          name: workoutName,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (workoutError || !createdWorkout) {
        throw workoutError || new Error("Failed to create workout.");
      }

      const workoutId = createdWorkout.id;

      // Step 2: Insert exercises into workout_exercises
      const exercisesToInsert = workoutExercises.map((e, index) => ({
        created_at: new Date().toISOString(),
        created_workout_id: workoutId,
        default_exercise_id: e.type === "default" ? e.id : null,
        custom_exercise_id: e.type === "custom" ? e.id : null,
        exercise_type: e.type,
        position: index,
        user_id: userId,
        exercise_name: e.name
      }));

      const { error: exercisesError } = await supabase
        .from("workout_exercises")
        .insert(exercisesToInsert);

      if (exercisesError) {
        throw exercisesError;
      }

      Alert.alert("Success", "Workout and exercises saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
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

export default CreateWorkoutScreen;

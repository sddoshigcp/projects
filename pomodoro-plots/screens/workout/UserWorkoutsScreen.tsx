import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

type Workout = {
  id: string;
  name: string;
  created_at: string;
};

const UserWorkoutsScreen = ({ navigation }: { navigation: any }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const user = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userId = user.data.user?.id;
      const { data, error } = await supabase
        .from("created_workouts")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        Alert.alert("Error", "Failed to fetch workouts.");
        return;
      }

      setWorkouts(data || []);
    };

    fetchWorkouts();
  }, []);

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      const { error } = await supabase
        .from("created_workouts")
        .delete()
        .eq("id", workoutId);

      if (error) throw error;

      setWorkouts((prev) => prev.filter((workout) => workout.id !== workoutId));
      setDeleteModalVisible(false);
      Alert.alert("Success", "Workout deleted successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete workout.");
    }
  };

  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate("EditWorkout", { workoutId: workout.id });
  };

  const confirmDelete = (workout: Workout) => {
    setSelectedWorkout(workout);
    setDeleteModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>My Workouts</Text>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <TouchableOpacity
              style={styles.workoutTextWrapper}
              onPress={() => handleWorkoutPress(item)}
            >
              <Text style={styles.workoutName}>{item.name}</Text>
              <Text style={styles.workoutDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.workoutTextWrapper}
              onPress={() => navigation.navigate("PerformWorkout", {workoutId: item.id})}
            >
              <Text style={styles.workoutName}>{"Perform Workout"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDelete(item)}
              style={styles.deleteIcon}
            >
              <Ionicons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete "{selectedWorkout?.name}"?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  selectedWorkout && handleDeleteWorkout(selectedWorkout.id)
                }
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  name: { fontSize: 24, marginBottom: 20 },
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutTextWrapper: { flex: 1 },
  workoutName: { fontSize: 18, fontWeight: "bold" },
  workoutDate: { fontSize: 14, color: "#888" },
  deleteIcon: { marginLeft: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalCancelButton: { backgroundColor: "#CCC" },
  modalButtonText: { color: "#FFF", fontSize: 16 },
});

export default UserWorkoutsScreen;

import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Error fetching authenticated user:", authError.message);
          setUsername(null);
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("user_id", user?.id)
          .single();

        if (error) {
          console.error("Error fetching user details:", error.message);
          setUsername(null);
        } else {
          setUsername(data.username);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      {loading ? (
        <ActivityIndicator size="large" color={styles.activityIndicator.color} />
      ) : username ? (
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      ) : (
        <Text style={styles.errorText}>Unable to fetch user details.</Text>
      )}

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Pomodoro Session"
            onPress={() => navigation.navigate("SessionHome")}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Workout"
            onPress={() => navigation.navigate("WorkoutHome")}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Account Details"
            onPress={() => navigation.navigate("Account")}
          />
        </View>
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
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "#D32F2F",
    marginBottom: 20,
  },
  activityIndicator: {
    color: "#6200EE",
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonWrapper: {
    marginBottom: 10,
    backgroundColor: "#6200EE",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default HomeScreen;

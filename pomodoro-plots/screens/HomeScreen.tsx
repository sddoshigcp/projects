import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        // Get the current authenticated user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Error fetching authenticated user:", authError.message);
          setUsername(null);
          return;
        }

        // Query the users table for the username
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
    <View>
      <Text>
        Home Screen
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : username ? (
        <Text>
          Welcome, {username}!
        </Text>
      ) : (
        <Text>
          Unable to fetch user details.
        </Text>
      )}

      <Button
        title="Start Session"
        onPress={() => navigation.navigate("SessionSetup")}
      />
      <Button
        title="View History"
        onPress={() => navigation.navigate("History")}
      />
      <Button
        title="Account Details"
        onPress={() => navigation.navigate("Account")}
      />
    </View>
  );
};

export default HomeScreen;

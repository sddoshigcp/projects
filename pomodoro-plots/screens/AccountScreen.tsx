import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabase";

const AccountScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();

    if (user.data) {
      setEmail(user.data.user?.email || "");
    } else {
      Alert.alert("Error", "No user found, please log in.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!username) {
      navigation.navigate("Home");
    }

    setLoading(true);

    const user = await supabase.auth.getUser();

    if (user.data) {
      const { id } = user.data.user;

      // Check if user already exists in the 'users' table
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", id)
        .single();

      if (error && error.code !== "PGRST116") {
        alert("Error: Unable to fetch user data.");
        setLoading(false);
        return;
      }

      if (data) {
        // User exists, update their details
        const { error: updateError } = await supabase
          .from("users")
          .update({
            username,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", id);

        if (updateError) {
          alert("Error: Unable to update user details.");
        } else {
          alert("Success: Account details updated.");
        }
      } else {
        // User does not exist, create a new entry
        const { error: insertError } = await supabase.from("users").insert([
          {
            user_id: id,
            username,
            updated_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          alert("Error: Unable to create new user.");
        } else {
          alert("Success: New account created.");
        }
      }
    } else {
      alert("Error: No user found, please log in.");
    }

    setLoading(false);
    navigation.navigate("Home");
  };

  const updatePassword = () => {
    //TODO
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Screen</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        editable={false}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.buttonContainer}>
        <Button
          disabled={loading}
          title="Update Password"
          onPress={updatePassword}
          color="#6200EE"
        />
        <Button
          disabled={loading}
          title="Save Account Details"
          onPress={handleSave}
          color="#6200EE"
        />
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
  input: {
    height: 40,
    borderColor: "#6200EE",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default AccountScreen;

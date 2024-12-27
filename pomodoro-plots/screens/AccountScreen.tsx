import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
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

    console.log("user here: ", user);

    if (user.data) {
      setEmail(user.data.user?.email || "");
    } else {
      Alert.alert("Error", "No user found, please log in.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!username) {
      Alert.alert("Error", "Username is required.");
      return;
    }

    setLoading(true);

    const user = await supabase.auth.getUser();

    console.log("user: ", user);

    if (user.data) {
      const { id } = user.data.user;

      console.log("id: ", id);

      // Check if user already exists in the 'users' table
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", id)
        .single();

      console.log("data: ", data);

      if (error && error.code !== "PGRST116") {
        console.log("error: ", error)
        // Handle error if any
        Alert.alert("Error", "Unable to fetch user data.");
        setLoading(false);
        return;
      }

      if (data) {
        console.log("if! data: ", data)
        // User exists, update their details
        const { error: updateError } = await supabase
          .from("users")
          .update({ username })
          .eq("user_id", id);

        if (updateError) {
          Alert.alert("Error", "Unable to update user details.");
        } else {
          Alert.alert("Success", "Account details updated.");
        }
      } else {
        console.log("else! username: ", id, username)

        // User does not exist, create a new entry
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ user_id: id, username: username }]);

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
  };

  const updatePassword = () => {
    //TODO
  };

  return (
    <View>
      <Text>Account Screen</Text>

      <TextInput placeholder="Email" editable={false} value={email} />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button
        disabled={loading}
        title="Update Password"
        onPress={updatePassword}
      />
      <Button
        disabled={loading}
        title="Save Account Details"
        onPress={handleSave}
      />
    </View>
  );
};

export default AccountScreen;

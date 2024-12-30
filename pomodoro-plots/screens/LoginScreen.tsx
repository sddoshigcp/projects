import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { supabase } from "../lib/supabase";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    signInWithEmail();
  };

  const signInWithEmail = async () => {
    setLoading(true);

    console.log("1")

    // Log in the user
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // After successful login, check if the user exists in the 'Users' table
    if (user) {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single(); // Get the user record

      if (fetchError || !data) {
        // If the user doesn't exist in the Users table, redirect to the Account setup page
        navigation.navigate("Account"); // Replace with the actual name of the Account screen
      } else {
        // If the user exists in the Users table, redirect to the Home page
        navigation.navigate("Home"); // Replace with the actual name of the Home screen
      }
    }

    setLoading(false);
  };

  return (
    <View>
      <Text>Login</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button disabled={loading} title="Login In" onPress={handleLogin} />
      <Button
        disabled={loading}
        title="Sign Up"
        onPress={() => navigation.navigate("Sign Up")}
      />
    </View>
  );
};

export default LoginScreen;

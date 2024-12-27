import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { supabase } from "../lib/supabase";

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");  // New state for confirm password
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
    await signUpWithEmail();
    navigation.navigate("Login");
  };

  async function signUpWithEmail() {
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  return (
    <View>
      <Text>Sign Up Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}  // Bind the confirm password input
      />
      <Button
        disabled={loading}
        title="Already have an account?"
        onPress={() => navigation.navigate("Login")}
      />
      <Button
        disabled={loading}
        title="Create Account"
        onPress={handleSignUp}
      />
    </View>
  );
};

export default SignUpScreen;

import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    console.log("Logging in with", username, password);
  };

  return (
    <View>
      <Text>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login In" onPress={handleLogin} />
      <Button title="Sign Up" onPress={() => navigation.navigate("Sign Up")} />
    </View>
  );
};

export default LoginScreen;

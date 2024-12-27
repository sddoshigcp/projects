import React from "react";
import { View, Text, Button, TextInput } from "react-native";

const SignupScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View>
      <Text>Sign Up Screen</Text>
      <TextInput></TextInput>
      <TextInput></TextInput>
      <TextInput></TextInput>
      <TextInput></TextInput>
      <Button
        title="Already have an account?"
        onPress={() => navigation.navigate("Sign Up")}
      />
      <Button title="Create Account" onPress={} />
    </View>
  );
};

export default SignupScreen;

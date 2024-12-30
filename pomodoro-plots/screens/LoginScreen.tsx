import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { supabase } from "../lib/supabase";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("bobrobmusic@gmail.com");
  const [password, setPassword] = useState("bobrobkabob1");
  const [loading, setLoading] = useState(false);

  //TODO: remove
  useEffect(() => {
    handleLogin()
  }, [])

  const handleLogin = () => {
    signInWithEmail();
  };

  const signInWithEmail = async () => {
    setLoading(true);

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

    if (user) {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError || !data) {
        navigation.navigate("Account");
      } else {
        navigation.navigate("Home");
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            disabled={loading}
            title={loading ? "Logging In..." : "Log In"}
            onPress={handleLogin}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            disabled={loading}
            title="Sign Up"
            onPress={() => navigation.navigate("Sign Up")}
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
    marginBottom: 40,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
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

export default LoginScreen;

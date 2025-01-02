import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Home Screen</Text>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Start Session"
            onPress={() => navigation.navigate("SessionSetup")}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="View History"
            onPress={() => navigation.navigate("SessionHistory")}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Return Home"
            onPress={() => navigation.navigate("Home")}
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

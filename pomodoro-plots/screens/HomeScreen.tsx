import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Start Session"
        onPress={() => navigation.navigate("SessionSetup")}
      />
      <Button
        title="View History"
        onPress={() => navigation.navigate("History")}
      />
    </View>
  );
};

export default HomeScreen;

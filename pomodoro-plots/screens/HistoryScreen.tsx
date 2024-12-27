import React from "react";
import { View, Text, Button } from "react-native";

const HistoryScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Return Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

export default HistoryScreen;

import React, { useState } from "react";
import { View, Text, Button, Picker } from "react-native";

const SessionSetupScreen = ({ navigation }: { navigation: any }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(15);

  // Generate options for the dropdown (15 min to 120 min)
  const minuteOptions = Array.from({ length: 8 }, (_, i) => (i + 1) * 15);
  minuteOptions.push(0.1);

  return (
    <View>
      <Text>Session Setup Screen</Text>
      <Text>Select Session Length:</Text>
      <Picker
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
      >
        {minuteOptions.map((minutes) => (
          <Picker.Item
            key={minutes}
            label={`${minutes} minutes`}
            value={minutes}
          />
        ))}
      </Picker>
      <Button
        title="Start Timer"
        onPress={() =>
          navigation.navigate("Session", { sessionLength: selectedMinutes })
        }
      />
    </View>
  );
};

export default SessionSetupScreen;

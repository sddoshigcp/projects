import React from "react";
import { View, Text, Button } from "react-native";

const SessionResultsScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {
    sessionLength,
    startTime,
    endTime,
    endedAutomatically,
    endedDueToFocusLoss,
  } = route.params;

  const getSessionEndMessage = () => {
    if (endedAutomatically) return "Session ended: Completed";
    if (endedDueToFocusLoss)
      return "Session ended: Incomplete (user lost focus)";
    return "Session ended: Incomplete (terminated manually)";
  };

  return (
    <View>
      <Text>Session Results</Text>
      <Text>Start Time: {startTime.toLocaleTimeString()}</Text>
      <Text>End Time: {endTime.toLocaleTimeString()}</Text>
      <Text>Session Length: {sessionLength} minutes</Text>
      <Text>{getSessionEndMessage()}</Text>
      <Button title="Return Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

export default SessionResultsScreen;

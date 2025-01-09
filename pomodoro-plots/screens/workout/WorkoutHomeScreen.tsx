import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text, Appbar, BottomNavigation } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import ExercisesModal from "./ExercisesModal";

const TodayRoute = () => <Text>Today</Text>;

const WorkoutHomeScreen = ({ navigation }: { navigation: any }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Navigation Stuff
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "today", title: "Today", focusedIcon: "calendar" },
    { key: "exercises", title: "Exercises", focusedIcon: "dumbbell" },
  ]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case "today":
        return <TodayRoute />;
      case "exercises":
        return <ExercisesModal />;
      default:
        return null;
    }
  };

  // Date Picker Stuff
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params: Date | undefined) => {
      setOpen(false);
      if (params) {
        setDate(params);
      }
    },
    [setOpen, setDate]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Home")} />
        <Appbar.Content title={date.toDateString()} />
        <Appbar.Action icon="calendar" onPress={() => setOpen(true)} />
      </Appbar.Header>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
        saveLabel={"Select"}
        validRange={{ endDate: today }}
      />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});

export default WorkoutHomeScreen;

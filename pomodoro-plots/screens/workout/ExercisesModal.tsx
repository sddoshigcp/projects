import React, { useState } from "react";
import { FlatList, View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, List, IconButton } from "react-native-paper";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const sampleData = [
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
];

const ExercisesModal = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const renderLeftActions = () => (
    <View style={styles.rightAction}>
      <IconButton
        icon="plus"
        size={30}
        onPress={() => {
          /* Add to today's exercises */
        }}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <TextInput
        label="Search"
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
        style={styles.searchBar}
      />
      <Button
        mode="contained"
        onPress={() => {
          /* Navigate to create exercise screen */
        }}
        style={styles.createButton}
      >
        Create Exercise
      </Button>
      <FlatList
        data={sampleData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReanimatedSwipeable renderLeftActions={renderLeftActions}>
            <List.Item
              style={{ backgroundColor: "white" }}
              title={item.name}
              description="Swipe right to add"
              left={(props) => <List.Icon {...props} icon="dumbbell" />}
            />
          </ReanimatedSwipeable>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  createButton: {
    marginBottom: 16,
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    padding: 16,
  },
});

export default ExercisesModal;

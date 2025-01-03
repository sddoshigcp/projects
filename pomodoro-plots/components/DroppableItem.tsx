import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const DroppableItem = ({ id, title, onRemove }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    ...styles.item,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <View ref={setNodeRef} style={style} {...attributes}>
      {/* Drag Handle */}
      <TouchableOpacity
        ref={setActivatorNodeRef}
        {...listeners}
        style={styles.dragHandle}
      >
        <Ionicons name="reorder-three" size={24} color="#888" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.text}>{title}</Text>

      {/* Remove Button */}
      <TouchableOpacity onPress={onRemove} style={styles.iconWrapper}>
        <Ionicons name="remove-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  dragHandle: {
    padding: 5,
    marginRight: 10,
  },
  iconWrapper: {
    marginLeft: 10,
  },
});

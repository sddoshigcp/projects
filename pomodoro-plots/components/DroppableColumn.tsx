import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { View, StyleSheet } from "react-native";
import { DroppableItem } from "./DroppableItem";

export const DroppableColumn = ({ items, onRemoveItem }) => {
  return (
    <View style={styles.column}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <DroppableItem
            key={item.id}
            id={item.id}
            title={item.name}
            onRemove={() => onRemoveItem(item.id)}
          />
        ))}
      </SortableContext>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    width: "100%",
    marginBottom: 20,
  },
});

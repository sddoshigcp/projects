import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DroppableItem } from "./DroppableItem";

export const DroppableColumn = ({ items }) => {
  return (
    <div className="column">
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <DroppableItem key={item.id} id={item.id} title={item.name} />
        ))}
      </SortableContext>
    </div>
  );
};

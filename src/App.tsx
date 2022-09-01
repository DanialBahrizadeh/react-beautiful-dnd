import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import type { Item } from "./model/Item";
import { useState } from "react";

const itemsFromBackend: Item[] = [
  { id: nanoid(), content: "First Task" },
  { id: nanoid(), content: "Second Task" },
  { id: nanoid(), content: "Third Task" },
  { id: nanoid(), content: "Fourth Task" },
  { id: nanoid(), content: "fifth Task" },
];

type Columns = {
  [key: string]: {
    name: string;
    items: Item[];
  };
};

const columnsFromBackend: Columns = {
  requested: {
    name: "Requested",
    items: itemsFromBackend,
  },
  todo: {
    name: "To do",
    items: [],
  },
  inProgress: {
    name: "In Progress",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};

const App: React.FC = () => {
  const [columns, setColumns] = useState(columnsFromBackend);

  const styles: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    height: "100%",
  };
  const droppableStyles = (
    snapshot: DroppableStateSnapshot
  ): React.CSSProperties => {
    return {
      backgroundColor: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
      padding: "4",
      width: "250px",
      minHeight: "500px",
      margin: "8px",
    };
  };
  const draggableStyles = (
    snapshot: DraggableStateSnapshot
  ): React.CSSProperties => {
    return {
      backgroundColor: snapshot.isDragging ? "#263b4a" : "#456c86",
      color: "white",
      userSelect: "none",
      padding: "16px",
      margin: "0 0 8px 0",
      minHeight: "50px",
    };
  };
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const srcColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const srcItems = [...srcColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = srcItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...prevColumns[source.droppableId],
          items: srcItems,
        },
        [destination.droppableId]: {
          ...prevColumns[destination.droppableId],
          items: destItems,
        },
      }));
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...prevColumns[source.droppableId],
          items: copiedItems,
        },
      }));
    }
  };
  return (
    <div style={styles}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={id}
            >
              <h2>{column.name}</h2>
              <Droppable droppableId={id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={droppableStyles(snapshot)}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  style={{
                                    ...draggableStyles(snapshot),
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {item.content}
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default App;

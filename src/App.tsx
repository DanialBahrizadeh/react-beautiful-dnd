import "./App.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { useState } from "react";

const App: React.FC = () => {
  const arr = [
    { id: nanoid(), value: "test 1" },
    { id: nanoid(), value: "test 2" },
    { id: nanoid(), value: "test 3" },
    { id: nanoid(), value: "test 4" },
    { id: nanoid(), value: "test 5" },
    { id: nanoid(), value: "test 6" },
    { id: nanoid(), value: "test 7" },
    { id: nanoid(), value: "test 8" },
  ];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination?.index) return;

    setChars((prevChars) => {
      const cloneChars = Array.from(prevChars);
      const [removed] = cloneChars.splice(result.source.index, 1);
      cloneChars.splice(result.destination?.index as number, 0, removed);
      return cloneChars;
    });
  };
  const [chars, setChars] = useState(arr);
  return (
    <div className="app">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="single">
          {(provided) => {
            return (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="item-container"
              >
                {chars.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => {
                        return (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="item"
                          >
                            {item.value}
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
      </DragDropContext>
    </div>
  );
};

export default App;

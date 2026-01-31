import React from "react";
import WorkflowCanvas from "./components/WorkflowCanvas";
import { useWorkflow } from "./hooks/useWorkflow";
import "./App.css";

function App() {
  const { workflow, addNode, deleteNode, editNode, moveNode, undo, redo } =
    useWorkflow();

  const handleSave = () => {
    console.log("Workflow Data:", JSON.stringify(workflow, null, 2));
    alert("Workflow saved to console!");
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  return (
    <div className="app">
      <header>
        <h1>Workflow Builder</h1>
        <div className="header-buttons">
          <button onClick={handleUndo}>Undo</button>
          <button onClick={handleRedo}>Redo</button>
          <button onClick={handleSave}>Save Workflow</button>
        </div>
      </header>
      <main>
        <WorkflowCanvas
          workflow={workflow}
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          onEditNode={editNode}
          onMoveNode={moveNode}
        />
      </main>
    </div>
  );
}

export default App;

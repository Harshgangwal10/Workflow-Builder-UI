import React from "react";
import WorkflowCanvas from "./components/WorkflowCanvas";
import { useWorkflow } from "./hooks/useWorkflow";
import "./App.css";

function App() {
  const { workflow, addNode, deleteNode, editNode, moveNode } = useWorkflow();

  const handleSave = () => {
    console.log("Workflow Data:", JSON.stringify(workflow, null, 2));
    alert("Workflow saved to console!");
  };

  return (
    <div className="app">
      <header>
        <h1>Workflow Builder</h1>
        <button onClick={handleSave}>Save Workflow</button>
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

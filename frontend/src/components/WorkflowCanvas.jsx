import React, { useState, useRef } from "react";
import Node from "./Node";
import Connection from "./Connection";
import AddNodeMenu from "./AddNodeMenu";
import "./WorkflowCanvas.css";

const WorkflowCanvas = ({
  workflow,
  onAddNode,
  onDeleteNode,
  onEditNode,
  onMoveNode,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(null);
  const canvasRef = useRef(null);

  // When a user clicks a connection point we open a small context menu
  // next to the parent node so they can choose the new node type and label.
  // We compute `menuPosition` from the parent's stored position so the menu
  // appears nearby 
  const handleAddChild = (parentId, branchIndex = null) => {
    setSelectedParentId(parentId);
    setSelectedBranchIndex(branchIndex);
    const parentNode = workflow.nodes[parentId];
    setMenuPosition({
      // Position the menu to the right of the parent node 
      x: parentNode.position.x + 220,
      y: parentNode.position.y,
    });
    setShowMenu(true);
  };

  // Called when the Add menu submits.
  const handleAddNode = (type, label) => {
    onAddNode(selectedParentId, type, label, selectedBranchIndex);
    setShowMenu(false);
    setSelectedBranchIndex(null);
  };

  // Clicks directly on the canvas should close the menu.
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setShowMenu(false);
    }
  };

  return (
    <div
      className="workflow-canvas"
      ref={canvasRef}
      onClick={handleCanvasClick}
    >
      <div className="canvas-content">
        {Object.values(workflow.nodes).map((node) => (
          <Node
            key={node.id}
            node={node}
            onEdit={onEditNode}
            onDelete={onDeleteNode}
            onAddChild={handleAddChild}
            onMove={onMoveNode}
          />
        ))}
        {workflow.connections.map((conn, index) => (
          <Connection
            key={index}
            from={conn.from}
            to={conn.to}
            workflow={workflow}
            branchIndex={conn.branchIndex}
          />
        ))}
        {showMenu && (
          <div
            className="menu-overlay"
            style={{ left: menuPosition.x, top: menuPosition.y }}
          >
            <AddNodeMenu
              onAddNode={handleAddNode}
              onClose={() => setShowMenu(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCanvas;

import React, { useState } from "react";
import "./Node.css";

const Node = ({ node, onEdit, onDelete, onAddChild, onMove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node.label);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editLabel.trim()) {
      onEdit(node.id, editLabel.trim());
      setIsEditing(false);
    }
  };

  // Dragging logic: record a start offset on mouse down and update node position as the mouse moves. 
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      // Compute the new absolute position using the previously stored offset
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onMove(node.id, { x: newX, y: newY });
    }
  };

  // Stop dragging: we only need to flip the boolean off position was already
  // applied through onMove during mouse move events.
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddToBranch = (branchIndex) => {
    onAddChild(node.id, branchIndex);
  };

  return (
    <div
      className={`node ${node.type}`}
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            autoFocus
            onBlur={handleEditSubmit}
          />
        </form>
      ) : (
        <div className="node-label" onDoubleClick={() => setIsEditing(true)}>
          {node.label}
        </div>
      )}

      {node.type === "branch" && (
        <div className="branch-connection-points">
          <div className="branch-item">
            <div
              className="connection-point true-branch"
              onClick={() => handleAddToBranch(0)}
            >
              +
            </div>
            <span className="branch-label">True</span>
          </div>
          <div className="branch-item">
            <div
              className="connection-point false-branch"
              onClick={() => handleAddToBranch(1)}
            >
              +
            </div>
            <span className="branch-label">False</span>
          </div>
        </div>
      )}

      {node.type !== "branch" && node.type !== "end" && (
        <div
          className="connection-point single"
          onClick={() => onAddChild(node.id)}
        >
          <span className="plus-icon">+</span>
        </div>
      )}

      <div className="node-actions">
        <button className="node-btn edit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        {node.type !== "start" && (
          <button className="node-btn delete" onClick={() => onDelete(node.id)}>
            Delete
          </button>
        )}
        {node.type === "branch" && (
          <button className="node-btn" onClick={() => onAddChild(node.id)}>
            Add Branch
          </button>
        )}
      </div>
    </div>
  );
};

export default Node;

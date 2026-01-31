import React, { useState } from "react";
import { NODE_TYPES } from "../utils/workflowData";
import "./AddNodeMenu.css";

// Uses controlled inputs
// so the parent (WorkflowCanvas) can provide the final onAddNode callback.
const AddNodeMenu = ({ onAddNode, onClose }) => {
  const [selectedType, setSelectedType] = useState(NODE_TYPES.ACTION);
  const [label, setLabel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (label.trim()) {
      onAddNode(selectedType, label.trim());
      onClose();
    }
  };

  return (
    <div className="add-node-menu">
      <form onSubmit={handleSubmit}>
        <h3>Add New Node</h3>
        <div className="form-group">
          <label>Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value={NODE_TYPES.ACTION}>Action</option>
            <option value={NODE_TYPES.BRANCH}>Branch</option>
            <option value={NODE_TYPES.END}>End</option>
          </select>
        </div>
        <div className="form-group">
          <label>Label:</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter node label"
            required
          />
        </div>
        <div className="buttons">
          <button type="submit">Add Node</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNodeMenu;

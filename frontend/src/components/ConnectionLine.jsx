import React from "react";

const ConnectionLine = ({ from, to, workflow, branchIndex }) => {
  // Draws a straight line between the parent (from) and child (to).
  // For branch nodes we offset the starting X depending on the branchIndex
  
  const fromNode = workflow.nodes[from];
  const toNode = workflow.nodes[to];

  if (!fromNode || !toNode) return null;

  let fromX, fromY;

  if (fromNode.type === "branch" && branchIndex !== undefined) {
   // pick different x offsets for the two branches
    fromX = fromNode.position.x + (branchIndex === 0 ? 50 : 150);
    fromY = fromNode.position.y + 80; // start line from bottom of node
  } else {
    // For normal nodes, use a center-right anchor point for the outgoing line
    fromX = fromNode.position.x + 100;
    fromY = fromNode.position.y + 80;
  }

  // Destination anchor: top-center of the child node
  const toX = toNode.position.x + 100;
  const toY = toNode.position.y;

  return (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="#666"
      strokeWidth="2"
      markerEnd="url(#arrowhead)"
    />
  );
};

export default ConnectionLine;

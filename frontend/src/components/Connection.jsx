import React from "react";
import ConnectionLine from "./ConnectionLine";

const ConnectionLayer = ({ workflow }) => {
  const { nodes } = workflow;

  const connections = [];

  Object.values(nodes).forEach((node) => {
    if (node.type === "branch") {
      (node.children || []).forEach((branch, branchIndex) => {
        if (Array.isArray(branch) && branch.length > 0) {
          connections.push({ from: node.id, to: branch[0], branchIndex });
        }
      });
    } else {
      (node.children || []).forEach((childId) => {
        connections.push({ from: node.id, to: childId });
      });
    }
  });

  return (
    <svg
      className="connections"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
      </defs>

      {connections.map((conn, index) => (
        <ConnectionLine
          key={index}
          from={conn.from}
          to={conn.to}
          branchIndex={conn.branchIndex}
          workflow={workflow}
        />
      ))}
    </svg>
  );
};

export default ConnectionLayer;

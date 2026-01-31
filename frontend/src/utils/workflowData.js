
export const initialWorkflow = {
  nodes: {
    'start': {
      id: 'start',
      type: 'start',
      label: 'Start',
      position: { x: 50, y: 50 },
      children: []
    }
  },
  connections: []
};


export const NODE_TYPES = {
  START: 'start',
  ACTION: 'action',
  BRANCH: 'branch',
  END: 'end'
};


export const generateId = () => Math.random().toString(36).substr(2, 9);

export const createNode = (type, label, position, children) => {
// Creates a new node.
// If children are provided, use them.
// If not:
// - Branch nodes get two empty arrays (true and false paths).
// - Other nodes get one empty children array.

  const nodeChildren = children !== undefined ? children : (type === NODE_TYPES.BRANCH ? [[], []] : []);
  return {
    id: generateId(),
    type,
    label,
    position,
    children: nodeChildren
  };
};

export const addNodeToWorkflow = (workflow, parentId, newNode, branchIndex = null) => {
  
  const updatedNodes = { ...workflow.nodes };
  const updatedConnections = [...workflow.connections];


  updatedNodes[newNode.id] = { ...newNode };

  const parent = { ...updatedNodes[parentId] };

  if (parent.type === NODE_TYPES.BRANCH) {
  
    parent.children = parent.children && parent.children.length ? parent.children.map(branch => [...branch]) : [[], []];
    const bIndex = branchIndex === null || branchIndex === undefined ? 0 : branchIndex;

    const branch = parent.children[bIndex];

    if (!branch || branch.length === 0) {
    
      parent.children[bIndex] = [...(parent.children[bIndex] || []), newNode.id];
      updatedConnections.push({ from: parentId, to: newNode.id, branchIndex: bIndex });
    } else {
      
      const lastChildId = branch[branch.length - 1];
      
      const lastChild = { ...updatedNodes[lastChildId] };
      lastChild.children = [...(lastChild.children || []), newNode.id];
      updatedNodes[lastChildId] = lastChild;

      parent.children[bIndex] = [...parent.children[bIndex], newNode.id];
      updatedConnections.push({ from: lastChildId, to: newNode.id });
    }
  } else {
  
    const existingChildren = parent.children ? [...parent.children] : [];

    parent.children = [newNode.id];

    
    if (existingChildren.length > 0) {
      
      if (newNode.type === NODE_TYPES.BRANCH) {
        updatedNodes[newNode.id].children = [[...existingChildren], []];
      } else {
        updatedNodes[newNode.id].children = [...existingChildren];
      }

    
      const filtered = updatedConnections.filter(conn => !(conn.from === parentId && existingChildren.includes(conn.to)));
      updatedConnections.length = 0;
      updatedConnections.push(...filtered);

     
      updatedConnections.push({ from: parentId, to: newNode.id });

  
      if (newNode.type === NODE_TYPES.BRANCH) {
     
        const firstChildren = updatedNodes[newNode.id].children[0] || [];
        if (firstChildren.length > 0) {
          updatedConnections.push({ from: newNode.id, to: firstChildren[0], branchIndex: 0 });
         
          for (let i = 1; i < firstChildren.length; i++) {
            updatedConnections.push({ from: firstChildren[i - 1], to: firstChildren[i] });
          }
        }
      } else {
        existingChildren.forEach(childId => {
          updatedConnections.push({ from: newNode.id, to: childId });
        });
      }
    } else {
      updatedConnections.push({ from: parentId, to: newNode.id });
    }
  }

  updatedNodes[parentId] = parent;

  return { ...workflow, nodes: updatedNodes, connections: updatedConnections };
};

export const deleteNodeFromWorkflow = (workflow, nodeId) => {
  const updatedNodes = { ...workflow.nodes };
  let updatedConnections = [...workflow.connections];


  let parentId = null;
  let parentBranchIndex = null;

  for (const [id, n] of Object.entries(updatedNodes)) {
    if (n.type === NODE_TYPES.BRANCH) {
      for (let b = 0; b < (n.children || []).length; b++) {
        const branch = n.children[b] || [];
        if (branch.includes(nodeId)) {
          parentId = id;
          parentBranchIndex = b;
          break;
        }
      }
      if (parentId) break;
    } else {
      if ((n.children || []).includes(nodeId)) {
        parentId = id;
        break;
      }
    }
  }

  if (parentId) {
    const parent = { ...updatedNodes[parentId] };

    if (parent.type === NODE_TYPES.BRANCH) {
      parent.children = parent.children.map((branch, idx) => idx === parentBranchIndex ? (branch || []).filter(id => id !== nodeId) : [...(branch || [])]);
    } else {
      parent.children = (parent.children || []).filter(id => id !== nodeId);
    }

    
    const node = updatedNodes[nodeId];
    if (node) {
      if (node.type === NODE_TYPES.BRANCH) {
      
        node.children.forEach((branchChildren, bIdx) => {
          (branchChildren || []).forEach(childId => {
            if (parent.type === NODE_TYPES.BRANCH) {
              const targetIdx = parentBranchIndex !== null ? parentBranchIndex : 0;
              parent.children[targetIdx] = [...(parent.children[targetIdx] || []), childId];
              updatedConnections.push({ from: parentId, to: childId, branchIndex: targetIdx });
            } else {
              parent.children = [...(parent.children || []), childId];
              updatedConnections.push({ from: parentId, to: childId });
            }
          });
        });
      } else {
        (node.children || []).forEach(childId => {
          if (parent.type === NODE_TYPES.BRANCH) {
            const targetIdx = parentBranchIndex !== null ? parentBranchIndex : 0;
            parent.children[targetIdx] = [...(parent.children[targetIdx] || []), childId];
            updatedConnections.push({ from: parentId, to: childId, branchIndex: targetIdx });
          } else {
            parent.children = [...(parent.children || []), childId];
            updatedConnections.push({ from: parentId, to: childId });
          }
        });
      }
    }

    updatedNodes[parentId] = parent;
  }

  
  updatedConnections = updatedConnections.filter(conn => conn.from !== nodeId && conn.to !== nodeId);


  delete updatedNodes[nodeId];

  return { ...workflow, nodes: updatedNodes, connections: updatedConnections };
};

import { useReducer } from 'react';
import { initialWorkflow, addNodeToWorkflow, deleteNodeFromWorkflow, createNode, NODE_TYPES } from '../utils/workflowData';

const ADD_NODE = 'ADD_NODE';
const DELETE_NODE = 'DELETE_NODE';
const EDIT_NODE = 'EDIT_NODE';
const MOVE_NODE = 'MOVE_NODE';


// Reducer: centralizes all workflow mutations.
// - ADD_NODE: delegates to addNodeToWorkflow 
// - DELETE_NODE: delegates to deleteNodeFromWorkflow (reconnects children)
// - EDIT_NODE: simple label update
// - MOVE_NODE: updates node position (used for dragging)1

const workflowReducer = (state, action) => {
  switch (action.type) {
    case ADD_NODE:
      return addNodeToWorkflow(state, action.parentId, action.newNode, action.branchIndex);
    case DELETE_NODE:
      return deleteNodeFromWorkflow(state, action.nodeId);
    case EDIT_NODE:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.nodeId]: {
            ...state.nodes[action.nodeId],
            label: action.label
          }
        }
      };
    case MOVE_NODE:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.nodeId]: {
            ...state.nodes[action.nodeId],
            position: action.position
          }
        }
      };
    default:
      return state;
  }
};


export const useWorkflow = () => {
  const [workflow, dispatch] = useReducer(workflowReducer, initialWorkflow);
const addNode = (parentId, type, label, branchIndex = null) => {
  const parent = workflow.nodes[parentId];
  let newPosition;

  const horizontalSpacing = 150; 
  const verticalSpacing = 150; 
  if (branchIndex !== null) {
    
    const offset = 80; 
    const baseX = parent.position.x + (branchIndex - 0.5) * offset * 2;
    const existingChildrenInBranch = parent.children[branchIndex] ? parent.children[branchIndex].length : 0;
    newPosition = {
      x: baseX + existingChildrenInBranch * horizontalSpacing,
      y: parent.position.y + verticalSpacing
    };
  } else {
 
    const existingChildrenCount = parent.children.length;
    newPosition = {
      x: parent.position.x + existingChildrenCount * horizontalSpacing,
      y: parent.position.y + verticalSpacing
    };
  }

  const newNode = createNode(type, label, newPosition);
  dispatch({ type: ADD_NODE, parentId, newNode, branchIndex });
};


  const deleteNode = (nodeId) => {
    dispatch({ type: DELETE_NODE, nodeId });
  };

  const editNode = (nodeId, label) => {
    dispatch({ type: EDIT_NODE, nodeId, label });
  };

  const moveNode = (nodeId, position) => {
    dispatch({ type: MOVE_NODE, nodeId, position });
  };

  return {
    workflow,
    addNode,
    deleteNode,
    editNode,
    moveNode
  };
};

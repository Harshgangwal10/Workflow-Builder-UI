import { useReducer, useState, useCallback } from 'react';
import { initialWorkflow, addNodeToWorkflow, deleteNodeFromWorkflow, createNode, NODE_TYPES } from '../utils/workflowData';

const ADD_NODE = 'ADD_NODE';
const DELETE_NODE = 'DELETE_NODE';
const EDIT_NODE = 'EDIT_NODE';
const MOVE_NODE = 'MOVE_NODE';
const SET_WORKFLOW = 'SET_WORKFLOW';


// Reducer: centralizes all workflow .
// - ADD_NODE: delegates to addNodeToWorkflow
// - DELETE_NODE: delegates to deleteNodeFromWorkflow (reconnects children)
// - EDIT_NODE: simple label update
// - MOVE_NODE: updates node position (used for dragging)
// - SET_WORKFLOW: sets the entire workflow state (used for undo/redo)

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
    case SET_WORKFLOW:
      return action.workflow;
    default:
      return state;
  }
};


export const useWorkflow = () => {
  const [workflow, dispatch] = useReducer(workflowReducer, initialWorkflow);
  const [history, setHistory] = useState([initialWorkflow]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const saveToHistory = useCallback((newWorkflow) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newWorkflow);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      dispatch({ type: SET_WORKFLOW, workflow: history[newIndex] });
    }
  }, [currentIndex, history, dispatch]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      dispatch({ type: SET_WORKFLOW, workflow: history[newIndex] });
    }
  }, [currentIndex, history, dispatch]);
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
  const newWorkflow = workflowReducer(workflow, { type: ADD_NODE, parentId, newNode, branchIndex });
  dispatch({ type: ADD_NODE, parentId, newNode, branchIndex });
  saveToHistory(newWorkflow);
};


  const deleteNode = (nodeId) => {
    const newWorkflow = workflowReducer(workflow, { type: DELETE_NODE, nodeId });
    dispatch({ type: DELETE_NODE, nodeId });
    saveToHistory(newWorkflow);
  };

  const editNode = (nodeId, label) => {
    const newWorkflow = workflowReducer(workflow, { type: EDIT_NODE, nodeId, label });
    dispatch({ type: EDIT_NODE, nodeId, label });
    saveToHistory(newWorkflow);
  };

  const moveNode = (nodeId, position) => {
    const newWorkflow = workflowReducer(workflow, { type: MOVE_NODE, nodeId, position });
    dispatch({ type: MOVE_NODE, nodeId, position });
    saveToHistory(newWorkflow);
  };

  return {
    workflow,
    addNode,
    deleteNode,
    editNode,
    moveNode,
    undo,
    redo
  };
};

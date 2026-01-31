# Workflow Builder UI

A React-based visual workflow builder application that allows users to create, edit, and manage complex workflow structures through an intuitive drag-and-drop interface.

## Features

### Core Functionality

- **Visual Workflow Canvas**: Interactive canvas for building workflows with nodes and connections
- **Node Types**: Support for multiple node types including Start, Action, Branch (Condition), and End nodes
- **Dynamic Layout**: Automatic positioning of nodes in a tree-like structure
- **Node Management**: Add, delete, and edit node properties (labels)
- **Connection System**: Visual connections between nodes representing workflow flow
- **Branching Logic**: Support for conditional branches with multiple paths (True/False)

### User Interactions

- **Add Nodes**: Context-sensitive menu for adding new nodes after existing ones
- **Delete Nodes**: Remove nodes while maintaining workflow continuity
- **Edit Labels**: Inline editing of node titles/labels
- **Drag & Drop**: Move nodes around the canvas (position updates)
- **Undo/Redo**: Revert or reapply changes to the workflow structure
- **Save Workflow**: Export current workflow structure to console (JSON format)

### Technical Implementation

- **React Hooks**: Functional components with useState, useReducer, and custom hooks
- **State Management**: Centralized state management using useReducer for workflow mutations
- **Modular Architecture**: Reusable components (Node, Connection, WorkflowCanvas, etc.)
- **CSS Styling**: Custom CSS with transitions for smooth interactions
- **No External Libraries**: Built without UI libraries or diagramming frameworks

## Technology Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development and building
- **Language**: JavaScript (ES6+)
- **Styling**: Pure CSS with CSS modules
- **State Management**: React useReducer for complex state logic

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd workflow-builder-ui/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

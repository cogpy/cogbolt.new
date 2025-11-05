# Quick Start Guide: OpenCog Integration

This guide will help you get started with the OpenCog cognitive architecture features in Bolt.new.

## Starting the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Accessing OpenCog Features

### 1. Start a Chat

Click "New Chat" or start typing a message to Bolt. Once the workbench opens, you'll see the OpenCog panel on the right side of the screen.

### 2. OpenCog Panel

The panel has two tabs:

#### 🧠 AtomSpace Tab
- View all atoms (knowledge nodes) in the system
- See cognitive processes and their progress
- Browse atoms by type (ConceptNode, PredicateNode, Links, etc.)
- Click on atoms to see details

#### 🤖 Agents Tab
- View all 5 autonomous agents:
  - Strategic Planner
  - Code Executor
  - System Monitor
  - Knowledge Learner
  - Coordination Agent
- See agent states (idle, thinking, acting, communicating, learning)
- Monitor task queue and assignments
- View agent statistics and performance

### 3. CogServer Terminal Commands

Press `Ctrl+G` in the terminal to enter CogServer mode:

```bash
# Show all available commands
cog> help

# List all atoms
cog> atoms

# List atoms with details
cog> atoms -v

# Show active agents
cog> agents

# Start/stop agents
cog> agent start "Strategic Planner"
cog> agent stop "Code Executor"

# View cognitive processes
cog> processes

# Create a new atom
cog> create-atom ConceptNode "My New Concept"

# Show system status
cog> status

# Clear AtomSpace
cog> clear

# Exit CogServer mode
cog> exit
```

## Demo Knowledge Graph

When you first open the workbench, a demo knowledge graph is automatically created with:

- **Web Development** concept
- **React Framework** concept (inherits from Web Development)
- **TypeScript** concept (inherits from Web Development)
- **Component-Based Architecture** pattern
- Relationships between concepts
- Truth values for each atom

## Working with Files

Files are automatically synchronized to the AtomSpace:

1. **Create a file** in Bolt → An atom is created in AtomSpace
2. **Modify a file** → Atom metadata is updated
3. **View in AtomSpace** → See the file represented as a ConceptNode

## Example Use Cases

### Use Case 1: Code Analysis

Ask Bolt to analyze your project:
```
"Analyze the architecture of this React application"
```

The Strategic Planner agent will:
1. Receive the task
2. Create atoms for discovered patterns
3. Link related concepts in AtomSpace
4. Generate insights

### Use Case 2: Knowledge Building

Create semantic relationships:
```bash
cog> create-atom ConceptNode "Database Layer"
cog> create-atom ConceptNode "API Layer"
# System will track these concepts and can infer relationships
```

### Use Case 3: Agent Collaboration

Create a task and watch agents collaborate:
1. Task created → Coordinator assigns to Planner
2. Planner breaks down → Executor implements
3. Monitor checks quality → Learner adapts

## Understanding the UI

### AtomSpace Viewer

- **Header**: Shows total atoms and processes
- **Processes Section**: Active cognitive processes with progress bars
- **Atoms Section**: Grouped by type with truth values
- **Truth Value Colors**:
  - 🟢 Green: High confidence (> 0.8)
  - 🟡 Yellow: Medium confidence (0.5-0.8)
  - 🔴 Red: Low confidence (< 0.5)

### Agent Orchestrator

- **Header**: Orchestration on/off toggle
- **Stats**: Active agents, completed tasks, success rate
- **Agents**: Each agent shows current state and task
- **Tasks**: Queue showing pending, in-progress, and completed tasks

## Advanced Features

### Creating Custom Atoms Programmatically

```typescript
import { atomSpaceStore } from '~/lib/stores/atomspace';

// Create a concept
const myAtom = atomSpaceStore.createAtom(
  'ConceptNode',
  'My Concept',
  undefined,
  { category: 'custom' }
);

// Create a relationship
const link = atomSpaceStore.createAtom(
  'InheritanceLink',
  'My Concept inherits from Parent',
  [myAtom.id, parentAtom.id]
);
```

### Creating Custom Tasks

```typescript
import { multiAgentStore } from '~/lib/stores/multiagent';

multiAgentStore.createTask('Custom analysis task', 8);
```

### Registering Custom CogServer Commands

```typescript
import { cogServerStore } from '~/lib/stores/cogserver';

cogServerStore.registerCommand({
  command: 'mycommand',
  description: 'My custom command',
  handler: (args, terminal) => {
    terminal.write('\r\nExecuting custom command\r\n');
    // Your logic here
  },
});
```

## Keyboard Shortcuts

- `Ctrl+G` - Toggle CogServer mode in terminal
- `Ctrl+C` - Cancel current CogServer command

## Monitoring and Debugging

### Watch Cognitive Processes

In the AtomSpace tab, you'll see:
- Attention Allocation (25-75% progress)
- Pattern Recognition (30% progress)
- Logical Inference (60% progress)

These show the cognitive architecture is actively processing.

### Check Agent Activity

In the Agents tab, monitor:
- Agent states changing (idle → thinking → acting)
- Tasks being assigned and completed
- Success rates improving over time

## Tips

1. **Let agents work**: Give the system time to process and assign tasks
2. **Use CogServer**: Explore the knowledge graph via terminal commands
3. **Watch patterns**: Notice how the system learns and adapts
4. **Create atoms**: Build your own knowledge structures
5. **Check stats**: Monitor agent performance in the UI

## Troubleshooting

### OpenCog panel not showing?
- Make sure you've started a chat
- Check that the workbench is open

### CogServer not responding?
- Make sure you pressed `Ctrl+G` to enter CogServer mode
- Type `help` to see available commands

### No demo data?
- Demo is initialized automatically on first workbench open
- Use `cog> status` to check system state

## Next Steps

1. Explore the [OPENCOG_README.md](./OPENCOG_README.md) for architectural details
2. Read the API reference for programmatic access
3. Experiment with creating your own atoms and agents
4. Build custom cognitive processes for your use case

Happy coding with cognitive AI! 🧠🤖

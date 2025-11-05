# OpenCog Integration for Bolt.new

This repository integrates OpenCog cognitive architecture with Bolt.new to create an autonomous multi-agent orchestration workbench.

## Overview

The OpenCog integration extends Bolt.new with cognitive capabilities including:

- **AtomSpace**: Knowledge representation system that tracks files, code, and relationships
- **CogServer**: Terminal-based interface for cognitive operations
- **Multi-Agent System**: Autonomous agents for planning, execution, monitoring, and learning
- **Cognitive Processes**: Active processes for reasoning, attention, and learning

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Bolt UI Frontend                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  CodeMirror  │  │  File Mgr    │  │  Terminal    │  │
│  │   Editor     │  │              │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         └─────────────────┼──────────────────┘          │
│                           │                             │
├───────────────────────────┼─────────────────────────────┤
│         OpenCog Core Agency (Cognitive Layer)           │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐    │
│  │              AtomSpace (Knowledge)              │    │
│  │  • File atoms                                  │    │
│  │  • Code concept nodes                          │    │
│  │  • Relationship links                          │    │
│  │  • Truth values                                │    │
│  └────────────┬───────────────────────────────────┘    │
│               │                                         │
│  ┌────────────┴───────────────────────────────────┐    │
│  │         CogServer (Terminal Interface)         │    │
│  │  Commands: help, atoms, agents, processes,     │    │
│  │           create-atom, status, clear           │    │
│  └────────────┬───────────────────────────────────┘    │
│               │                                         │
│  ┌────────────┴───────────────────────────────────┐    │
│  │      Multi-Agent Orchestration System          │    │
│  │  • Strategic Planner                           │    │
│  │  • Code Executor                               │    │
│  │  • System Monitor                              │    │
│  │  • Knowledge Learner                           │    │
│  │  • Coordination Agent                          │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │      Cognitive Processes (Background)          │    │
│  │  • Attention allocation                        │    │
│  │  • Pattern recognition                         │    │
│  │  • Reasoning chains                            │    │
│  │  • Learning mechanisms                         │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Features

### 1. AtomSpace Knowledge Representation

The AtomSpace maintains a graph-based knowledge representation of your project:

- **ConceptNodes**: Represent files, folders, and code concepts
- **Links**: Define relationships between atoms (inheritance, similarity, etc.)
- **Truth Values**: Each atom has strength (0-1) and confidence (0-1) values
- **File Synchronization**: Automatically creates atoms when files are added/modified

### 2. CogServer Terminal Interface

Access OpenCog through the terminal with CogServer commands:

```bash
# Toggle CogServer mode in terminal
Ctrl+G

# Available commands:
cog> help              # Show all available commands
cog> atoms             # List all atoms in AtomSpace
cog> atoms -v          # Verbose atom listing with details
cog> agents            # List active cognitive agents
cog> processes         # Show cognitive processes
cog> create-atom ConceptNode "MyIdea"  # Create new atom
cog> status            # Show CogServer status
cog> clear             # Clear AtomSpace
cog> exit              # Exit CogServer mode
```

### 3. Multi-Agent Orchestration

Five autonomous agents work together:

1. **Strategic Planner** (planner)
   - Creates high-level plans
   - Sets goals and strategies
   - Manages task decomposition

2. **Code Executor** (executor)
   - Executes code operations
   - Manages file operations
   - Handles deployment tasks

3. **System Monitor** (monitor)
   - Monitors system state
   - Provides diagnostics
   - Generates reports

4. **Knowledge Learner** (learner)
   - Learns from patterns
   - Adapts behavior
   - Improves performance

5. **Coordination Agent** (coordinator)
   - Coordinates agent activities
   - Allocates tasks
   - Manages communication

### 4. Cognitive Processes

Background processes that enhance cognitive capabilities:

- **Attention**: Focus on important atoms/tasks
- **Reasoning**: Perform logical inference
- **Learning**: Pattern recognition and adaptation
- **Planning**: Goal-oriented action planning

## Usage

### Accessing the OpenCog Panel

When you start a chat in Bolt.new, the OpenCog panel appears on the right side of the screen with two tabs:

1. **🧠 AtomSpace**: View and explore the knowledge graph
2. **🤖 Agents**: Manage autonomous agents and tasks

### Creating Custom Atoms

You can create atoms programmatically or via CogServer:

```typescript
// Programmatically
import { atomSpaceStore } from '~/lib/stores/atomspace';

const myAtom = atomSpaceStore.createAtom(
  'ConceptNode',
  'MyCustomConcept',
  undefined,
  { metadata: 'value' }
);
```

```bash
# Via CogServer
cog> create-atom ConceptNode "MyCustomConcept"
```

### Managing Agents

Agents can be started/stopped via the UI or CogServer:

```bash
cog> agent start "Strategic Planner"
cog> agent stop "Code Executor"
```

### Creating Tasks

Tasks are automatically assigned to the most suitable agent:

```typescript
import { multiAgentStore } from '~/lib/stores/multiagent';

multiAgentStore.createTask('Analyze codebase structure', 7);
```

## Integration Points

### File Manager ↔ AtomSpace

Files are automatically synchronized to AtomSpace:
- New files create ConceptNode atoms
- File modifications update atom metadata
- File relationships create link atoms

### Terminal ↔ CogServer

The terminal integrates CogServer commands:
- Press `Ctrl+G` to toggle CogServer mode
- All CogServer commands available
- Command history maintained

### Editor ↔ Cognitive Processes

Active cognitive processes monitor editor activity:
- Code analysis processes
- Pattern recognition
- Intelligent suggestions

## Development

### Building

```bash
npm install
npm run build
```

### Running

```bash
npm run dev
```

### Testing

```bash
npm test
```

## API Reference

### AtomSpace API

```typescript
// Create an atom
atomSpaceStore.createAtom(type, name, outgoing?, metadata?)

// Get atom by ID
atomSpaceStore.getAtom(atomId)

// Get atoms by type
atomSpaceStore.getAtomsByType('ConceptNode')

// Update truth value
atomSpaceStore.updateTruthValue(atomId, { strength: 0.9 })

// Link file to atom
atomSpaceStore.linkFileToAtom(filePath, atomId)

// Sync files
atomSpaceStore.syncFilesWithAtomSpace(files)
```

### CogServer API

```typescript
// Execute command
cogServerStore.executeCommand('help', terminal)

// Register custom command
cogServerStore.registerCommand({
  command: 'mycommand',
  description: 'My custom command',
  handler: (args, terminal) => { /* ... */ }
})

// Register agent
cogServerStore.registerAgent('My Agent', 'reasoning', 1.0)
```

### Multi-Agent API

```typescript
// Create agent
multiAgentStore.createAgent('Agent Name', 'planner', ['capability1'])

// Create task
multiAgentStore.createTask('Task description', priority)

// Update agent state
multiAgentStore.updateAgentState(agentId, 'thinking')

// Get statistics
const stats = multiAgentStore.getAgentStats()
```

## Future Enhancements

Planned features for future releases:

- [ ] Pattern mining from code
- [ ] Automated code generation based on patterns
- [ ] Natural language to AtomSpace queries
- [ ] Agent collaboration protocols
- [ ] Learning from user interactions
- [ ] Hypergraph visualization
- [ ] MOSES integration for program learning
- [ ] PLN (Probabilistic Logic Networks) reasoning
- [ ] ECAN (Economic Attention Networks)

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenCog Foundation for the cognitive architecture concepts
- StackBlitz team for Bolt.new
- The cognitive AI research community

## References

- [OpenCog Wiki](https://wiki.opencog.org/)
- [AtomSpace Documentation](https://wiki.opencog.org/w/AtomSpace)
- [Bolt.new Documentation](https://github.com/stackblitz/bolt.new)

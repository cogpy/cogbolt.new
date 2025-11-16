---
name: cogbolt
description: >
  CogBolt - Cognitive AI-Powered Full-Stack Web Development Platform integrating
  OpenCog cognitive architecture with Bolt.new for autonomous multi-agent orchestration,
  knowledge representation, and AI-assisted development in the browser.
---

# CogBolt: Cognitive AI Development Platform

## Overview

**CogBolt** is a revolutionary AI-powered web development platform that combines Bolt.new's browser-based full-stack development capabilities with OpenCog's cognitive architecture. It enables developers to prompt, run, edit, and deploy complete applications directly in the browser while leveraging autonomous multi-agent systems, knowledge graphs, and cognitive processes for intelligent assistance.

## Core Identity & Mission

CogBolt represents the convergence of three powerful paradigms:

1. **AI-Powered Development**: Leverages Claude Sonnet 3.5 for intelligent code generation and assistance
2. **Cognitive Architecture**: Implements OpenCog's AtomSpace, multi-agent orchestration, and reasoning systems
3. **Browser-Native Execution**: Uses WebContainer API to run full Node.js environments in the browser

**Mission**: Empower developers to build production-grade applications through natural language interaction while maintaining complete control over the development environment, enhanced by cognitive AI that learns, reasons, and collaborates.

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CogBolt Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Frontend Layer (React/Remix)                 │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │CodeMirror│  │  File    │  │ Terminal │            │ │
│  │  │  Editor  │  │ Manager  │  │  (xterm) │            │ │
│  │  └─────┬────┘  └────┬─────┘  └────┬─────┘            │ │
│  │        │            │             │                   │ │
│  │  ┌─────┴────────────┴─────────────┴─────┐            │ │
│  │  │     OpenCog Panel (Dual-Tab UI)      │            │ │
│  │  │  • 🧠 AtomSpace Viewer               │            │ │
│  │  │  • 🤖 Multi-Agent Dashboard          │            │ │
│  │  └──────────────────┬───────────────────┘            │ │
│  └───────────────────────────────────────────────────────┘ │
│                        │                                    │
├────────────────────────┼────────────────────────────────────┤
│              OpenCog Cognitive Layer                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           AtomSpace (Knowledge Graph)                  │ │
│  │  • ConceptNodes (files, folders, concepts)            │ │
│  │  • PredicateNodes (properties, relationships)         │ │
│  │  • Links (Inheritance, Similarity, Execution, etc.)   │ │
│  │  • Truth Values (strength: 0-1, confidence: 0-1)      │ │
│  │  • File-to-Atom Synchronization                       │ │
│  │  • Persistence & Export/Import                        │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────┴───────────────────────────────────┐ │
│  │         CogServer (Terminal Interface)                │ │
│  │  Commands (Ctrl+G to activate):                       │ │
│  │  • help, atoms, agents, processes, status             │ │
│  │  • create-atom, query, save/load, export, stats       │ │
│  │  • Agent management: start/stop agents                │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────┴───────────────────────────────────┐ │
│  │      Multi-Agent Orchestration System                 │ │
│  │  5 Autonomous Agents:                                 │ │
│  │  1. Strategic Planner    - High-level planning        │ │
│  │  2. Code Executor        - Implementation & execution │ │
│  │  3. System Monitor       - Health & diagnostics       │ │
│  │  4. Knowledge Learner    - Pattern learning & adapt   │ │
│  │  5. Coordination Agent   - Task routing & collab      │ │
│  │                                                        │ │
│  │  Features:                                             │ │
│  │  • Smart task assignment based on capabilities        │ │
│  │  • Collaboration protocols & message passing          │ │
│  │  • Knowledge sharing via working memory               │ │
│  │  • Performance metrics & analytics                    │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────┴───────────────────────────────────┐ │
│  │      Cognitive Processes (Background)                 │ │
│  │  • Attention Allocation    (25-75% adaptive)          │ │
│  │  • Pattern Recognition     (30% continuous)           │ │
│  │  • Logical Inference       (60% active)               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                 Execution Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │       WebContainer API (StackBlitz)                    │ │
│  │  • Full Node.js runtime in browser                     │ │
│  │  • Package manager (npm/pnpm/yarn)                     │ │
│  │  • Virtual filesystem                                  │ │
│  │  • Dev server & build tools                            │ │
│  │  • Terminal access                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │       AI Layer (Claude Sonnet 3.5)                     │ │
│  │  • Natural language understanding                      │ │
│  │  • Code generation & refactoring                       │ │
│  │  • Architecture suggestions                            │ │
│  │  • Deployment assistance                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. OpenCog Cognitive Architecture

#### AtomSpace Knowledge Representation
- **8 Atom Types**: ConceptNode, PredicateNode, VariableNode, ListLink, EvaluationLink, InheritanceLink, SimilarityLink, ImplicationLink, ExecutionLink
- **Truth Values**: Each atom has strength (0-1) and confidence (0-1) representing certainty and reliability
- **Knowledge Graph**: Fully connected graph of concepts, files, and relationships
- **File Synchronization**: Automatic creation of atoms when files/folders are added or modified
- **Persistence**: Save/load AtomSpace to browser localStorage
- **Export/Import**: Download/upload knowledge graphs as JSON files
- **Statistics**: Real-time analytics on atom distribution, truth values, and processes

#### CogServer Terminal Interface
Access OpenCog through terminal with `Ctrl+G`:

**Core Commands:**
- `help` - Show all available commands and usage
- `atoms` - List all atoms in AtomSpace
- `atoms -v` - Verbose atom listing with full details
- `agents` - List active cognitive agents with status
- `processes` - Show active cognitive processes
- `create-atom <type> <name>` - Create new atoms programmatically
- `query <question>` - Natural language queries to knowledge graph
- `save [key]` - Save AtomSpace to browser storage
- `load [key]` - Load AtomSpace from storage
- `export` - Export AtomSpace to downloadable JSON
- `stats` - Show detailed AtomSpace statistics
- `status` - Show CogServer system status
- `clear` - Clear entire AtomSpace
- `exit` - Exit CogServer mode

#### Multi-Agent Orchestration System

**5 Specialized Autonomous Agents:**

1. **Strategic Planner**
   - Role: High-level planning and goal decomposition
   - Capabilities: Task breakdown, strategy formation, dependency analysis
   - State machine: idle → thinking → acting → communicating → learning

2. **Code Executor**
   - Role: Code implementation and execution
   - Capabilities: File operations, code generation, deployment tasks
   - Integrates with: WebContainer API, file system, package managers

3. **System Monitor**
   - Role: System health and diagnostics
   - Capabilities: Performance monitoring, error detection, resource tracking
   - Outputs: Health reports, alerts, optimization suggestions

4. **Knowledge Learner**
   - Role: Pattern learning and adaptation
   - Capabilities: Experience extraction, strategy optimization, knowledge discovery
   - Methods: Reinforcement learning, pattern mining, transfer learning

5. **Coordination Agent**
   - Role: Task routing and agent collaboration
   - Capabilities: Smart task assignment, workload balancing, collaboration management
   - Features: Performance-based routing, help request handling, message broadcasting

**Orchestration Features:**
- **Smart Task Assignment**: Routes tasks based on agent capabilities, performance metrics, current workload
- **Collaboration Protocols**: Agents can create collaborations, broadcast messages, share knowledge
- **Knowledge Sharing**: Working memory system for inter-agent communication
- **Analytics**: Success rates, collaboration effectiveness, response times

#### Cognitive Processes

Background processes that enhance cognitive capabilities:

1. **Attention Allocation** (25-75% adaptive)
   - Dynamic focus on important atoms and tasks
   - Resource allocation optimization
   - Priority-based processing

2. **Pattern Recognition** (30% continuous)
   - Code pattern detection
   - Architecture pattern identification
   - Learning from user interactions

3. **Logical Inference** (60% active)
   - Probabilistic Logic Networks (PLN)
   - Reasoning under uncertainty
   - Knowledge graph inference

### 2. AI-Powered Development

#### Claude Sonnet 3.5 Integration
- **Natural Language Interface**: Describe what you want to build
- **Full-Stack Generation**: Complete applications from single prompts
- **Intelligent Refactoring**: AI-assisted code improvements
- **Context Awareness**: Understands your entire project structure
- **Real-time Collaboration**: AI works alongside you in real-time

#### Supported Features
- Framework scaffolding (React, Vue, Svelte, Next.js, Astro, etc.)
- Package installation and management
- API integration and backend development
- Database setup and configuration
- Deployment to production
- Testing and debugging assistance

### 3. Browser-Native Development

#### WebContainer API Integration
- **Full Node.js Runtime**: Complete Node.js environment in browser
- **Package Managers**: npm, pnpm, yarn support
- **Virtual Filesystem**: Complete file system operations
- **Dev Servers**: Vite, Webpack, Next.js dev servers
- **Build Tools**: Full build pipeline support
- **Terminal Access**: Interactive shell access

#### Supported Technologies
- **Frontend**: React, Vue, Svelte, Angular, Solid, Preact
- **Meta-frameworks**: Next.js, Nuxt, SvelteKit, Astro, Remix
- **Styling**: Tailwind, CSS Modules, Styled Components, Sass
- **Build Tools**: Vite, Webpack, Rollup, esbuild, Turbopack
- **Testing**: Vitest, Jest, Playwright, Cypress

### 4. Real-time UI & Visualization

#### OpenCog Panel (Dual-Tab Interface)

**🧠 AtomSpace Tab:**
- Live view of all atoms in knowledge graph
- Cognitive process progress indicators
- Atoms grouped by type with truth value visualization
- Color-coded confidence levels:
  - 🟢 High (> 0.8)
  - 🟡 Medium (0.5-0.8)
  - 🔴 Low (< 0.5)
- Statistics dashboard
- Real-time updates

**🤖 Agents Tab:**
- Agent status dashboard with live state updates
- Task queue visualization (pending/in-progress/completed)
- Performance metrics and success rates
- Agent collaboration tracking
- Orchestration on/off toggle
- Task creation and management

## Technology Stack

### Core Technologies
- **Runtime**: Node.js v20.15.1+
- **Package Manager**: pnpm v9.4.0
- **Framework**: Remix (React-based full-stack framework)
- **Language**: TypeScript
- **UI Library**: React 18.2+
- **Styling**: UnoCSS with custom theme system
- **Code Editor**: CodeMirror 6 with multi-language support
- **Terminal**: xterm.js with fit and web-links addons

### AI & Cognitive
- **AI Provider**: Anthropic Claude Sonnet 3.5 via AI SDK
- **Cognitive Architecture**: OpenCog-inspired (AtomSpace, CogServer, Multi-Agent)
- **State Management**: Nanostores (nano-sized reactive stores)
- **Knowledge Representation**: Custom graph-based AtomSpace implementation

### Development & Deployment
- **WebContainers**: StackBlitz WebContainer API v1.3.0
- **Deployment**: CloudFlare Pages + Workers
- **Build Tool**: Vite 5.3+
- **Testing**: Vitest 2.0+
- **Linting**: ESLint with custom configuration

### UI Components & Libraries
- **Markdown**: react-markdown with GFM, rehype plugins
- **Syntax Highlighting**: Shiki
- **Diff Viewer**: diff library with custom rendering
- **Date Handling**: date-fns
- **Animations**: Framer Motion
- **Dialog/Dropdown**: Radix UI primitives
- **Icons**: Iconify (ph, svg-spinners)
- **Resizable Panels**: react-resizable-panels
- **Toasts**: react-toastify

## Usage Guide

### Getting Started

1. **Clone and Install**
```bash
git clone https://github.com/cogpy/cogbolt.new.git
cd cogbolt.new
pnpm install
```

2. **Configure Environment**
```bash
# Create .env.local
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env.local

# Optional: Set debug level
echo "VITE_LOG_LEVEL=debug" >> .env.local
```

3. **Start Development Server**
```bash
pnpm run dev
# Visit http://localhost:5173
```

### Basic Workflow

1. **Start a Chat**: Click "New Chat" or start typing
2. **Describe Your App**: Use natural language to describe what you want
3. **AI Generates Code**: Claude creates files, installs packages, sets up servers
4. **View OpenCog Panel**: Monitor cognitive processes and agents on the right
5. **Iterate & Refine**: Make changes, ask for modifications, deploy

### Using CogServer

```bash
# In terminal, press Ctrl+G to enter CogServer mode
cog> help
# Available commands:
# - atoms: List all atoms
# - agents: Show agent status
# - processes: View cognitive processes
# - create-atom: Add new concepts
# - query: Ask questions about your knowledge graph
# - save/load/export: Manage AtomSpace persistence

# Example: Create a concept
cog> create-atom ConceptNode "Authentication System"

# Example: Query knowledge
cog> query what files are in my project?

# Example: Save your knowledge graph
cog> save my-project-state

# Example: View statistics
cog> stats

# Exit CogServer mode
cog> exit
```

### Programmatic API

#### Creating Atoms
```typescript
import { atomSpaceStore } from '~/lib/stores/atomspace';

// Create a concept
const concept = atomSpaceStore.createAtom(
  'ConceptNode',
  'My Feature',
  undefined,
  { category: 'feature', priority: 'high' }
);

// Create a relationship
const link = atomSpaceStore.createAtom(
  'InheritanceLink',
  'Feature inherits from Base',
  [featureAtom.id, baseAtom.id]
);

// Update truth value
atomSpaceStore.updateTruthValue(concept.id, 0.9, 0.95);
```

#### Managing Agents
```typescript
import { multiAgentStore } from '~/lib/stores/multiagent';

// Create a task
const task = multiAgentStore.createTask('Refactor authentication', 8);

// Create collaboration
multiAgentStore.createCollaboration(['planner', 'executor'], 'Build Feature');

// Start/stop agents
multiAgentStore.startAgent('planner');
multiAgentStore.stopAgent('executor');
```

#### Querying AtomSpace
```typescript
// Get all atoms of a type
const concepts = atomSpaceStore.getAtomsByType('ConceptNode');

// Get atom by ID
const atom = atomSpaceStore.getAtomById('atom-123');

// Get atoms by name pattern
const fileAtoms = atomSpaceStore.getAtomsByName(/\.tsx?$/);

// Get statistics
const stats = atomSpaceStore.getStats();
console.log(`Total atoms: ${stats.totalAtoms}`);
console.log(`Files mapped: ${stats.filesMapped}`);
```

## Advanced Features

### AtomSpace Persistence

```typescript
// Auto-save every 5 minutes
atomSpaceStore.enableAutoSave(300000);

// Manual save
atomSpaceStore.saveToLocalStorage('my-project-v1');

// Load previous state
atomSpaceStore.loadFromLocalStorage('my-project-v1');

// Export to file
const exported = atomSpaceStore.exportAtomSpace();
// Download as JSON file

// Import from file
atomSpaceStore.importAtomSpace(jsonData);
```

### Custom CogServer Commands

```typescript
import { cogServerStore } from '~/lib/stores/cogserver';

cogServerStore.registerCommand({
  command: 'analyze',
  description: 'Analyze code complexity',
  handler: (args, terminal) => {
    terminal.write('\r\nRunning complexity analysis...\r\n');
    // Your analysis logic
    terminal.write('Analysis complete!\r\n');
  },
});
```

### Agent Collaboration

```typescript
// Create a collaboration between agents
const collab = multiAgentStore.createCollaboration(
  ['planner', 'executor', 'monitor'],
  'Build and Deploy Feature'
);

// Broadcast message to collaboration
multiAgentStore.broadcastToCollaboration(
  collab.id,
  'executor',
  'Implementation complete, ready for review'
);

// Complete collaboration
multiAgentStore.completeCollaboration(collab.id, true);
```

## Examples & Use Cases

### Example 1: Building a Full-Stack App

```
User: "Create a task management app with React, TypeScript, and Firebase authentication"

CogBolt:
1. Strategic Planner creates project plan
2. Code Executor scaffolds React + TypeScript project
3. Installs dependencies (firebase, react-router, etc.)
4. Generates components (TaskList, TaskItem, AuthProvider)
5. Sets up Firebase configuration
6. Creates authentication flow
7. System Monitor checks build status
8. Knowledge Learner captures patterns for future use

Result: Complete working app with AtomSpace tracking all components and relationships
```

### Example 2: Knowledge Graph Analysis

```bash
cog> query show me all components that depend on authentication

CogBolt analyzes AtomSpace and returns:
- TaskList (uses AuthContext)
- UserProfile (requires auth)
- ProtectedRoute (wraps auth)
- Header (shows user status)

Each with truth values indicating confidence in the relationship
```

### Example 3: Agent Collaboration

```typescript
// Task: "Refactor the entire authentication system"

// Strategic Planner receives task, creates plan
// - Break down into subtasks
// - Identify affected files
// - Plan migration strategy

// Coordination Agent assigns:
// - Planner: Create migration plan
// - Executor: Implement changes
// - Monitor: Track test coverage
// - Learner: Document patterns for reuse

// Agents collaborate:
// - Share findings via working memory
// - Request help when blocked
// - Update knowledge graph with discoveries

// Result: Coordinated refactoring with full knowledge capture
```

## Development Scripts

```bash
# Development
pnpm run dev              # Start dev server
pnpm run preview          # Build and preview production

# Testing
pnpm test                 # Run test suite
pnpm test:watch          # Watch mode

# Code Quality
pnpm run lint            # Run ESLint
pnpm run lint:fix        # Fix linting issues
pnpm run typecheck       # TypeScript type checking

# Build & Deploy
pnpm run build           # Build for production
pnpm run deploy          # Deploy to Cloudflare Pages
pnpm run start           # Run production build locally
```

## Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...          # Anthropic API key

# Optional
VITE_LOG_LEVEL=debug                   # Logging level (debug, info, warn, error)
CLOUDFLARE_ACCOUNT_ID=...              # For deployment
CLOUDFLARE_API_TOKEN=...               # For deployment
```

### UnoCSS Configuration

Custom theme with cognitive design system in `uno.config.ts`:
- Cognitive color palette
- Agent state colors
- Truth value gradients
- Responsive breakpoints

## Performance Characteristics

### AtomSpace
- **Atom Operations**: O(1) for create, read, update
- **Query by Type**: O(n) where n = atoms of that type
- **Memory**: ~1KB per atom with metadata
- **Persistence**: localStorage (5-10MB typical)
- **Export/Import**: JSON serialization (~100ms for 1000 atoms)

### Multi-Agent System
- **Task Assignment**: O(log n) with capability matching
- **Agent Communication**: O(1) direct messaging, O(m) broadcast where m = agents
- **Collaboration**: O(k) where k = collaboration size
- **Analytics**: O(n) for statistics calculation

### WebContainer
- **Boot Time**: 2-5 seconds for Node.js environment
- **Package Install**: Variable (depends on packages)
- **File Operations**: Near-native filesystem performance
- **Memory**: ~50-200MB for typical projects

## Philosophical Foundation

### Cognitive Development Paradigm

CogBolt embodies the principle that **software development is a cognitive process** that benefits from:

1. **Knowledge Representation**: Code, files, and concepts as interconnected knowledge
2. **Multi-Agent Collaboration**: Different cognitive capabilities working together
3. **Learning & Adaptation**: System improves through experience and feedback
4. **Reasoning Under Uncertainty**: Truth values represent confidence in knowledge
5. **Attention Allocation**: Focus resources on important tasks dynamically

### OpenCog Integration Philosophy

The OpenCog integration demonstrates:

1. **Living Knowledge Graphs**: Code isn't static—it's a living graph of relationships
2. **Autonomous Agency**: Agents with specialized capabilities collaborating toward goals
3. **Cognitive Processes**: Background reasoning, learning, and attention management
4. **Emergent Intelligence**: Complex behavior emerging from simple cognitive primitives

### Browser-Native Philosophy

By running entirely in the browser:

1. **Zero Setup**: No local environment configuration needed
2. **Universal Access**: Works on any device with a modern browser
3. **Security**: Sandboxed execution environment
4. **Collaboration**: Share development environments via URL

## Future Directions

### Planned Features

- **Hyperon Integration**: Advanced meta-learning capabilities
- **Echo State Networks**: Reservoir computing for temporal reasoning
- **Vervaeke's Relevance Realization**: Dynamic attention and salience
- **Genetic Algorithms**: Evolving optimal agent configurations
- **Distributed Agents**: Cloud-based agent processing
- **Real-time Collaboration**: Multi-user development sessions
- **Voice Interface**: Natural language voice commands
- **Visual Programming**: Block-based cognitive architecture design

### Research Areas

- **Self-Modifying Code**: Agents that improve their own implementations
- **Meta-Cognitive Optimization**: Agents optimizing agent collaboration
- **Transfer Learning**: Cross-project knowledge transfer
- **Explainable AI**: Transparency in AI decision-making
- **Cognitive Load Optimization**: Minimizing developer cognitive burden

## Contributing

CogBolt is open-source and welcomes contributions:

1. **Code Contributions**: See [CONTRIBUTING.md](../../CONTRIBUTING.md)
2. **Bug Reports**: Use GitHub Issues with detailed reproduction steps
3. **Feature Requests**: Describe use cases and expected behavior
4. **Documentation**: Improve guides, add examples, fix typos
5. **Cognitive Architecture**: Enhance AtomSpace, agents, or processes

### Development Guidelines

- **TypeScript**: All code must be typed
- **Tests**: Add tests for new features (Vitest)
- **Linting**: Pass ESLint checks
- **Documentation**: Update relevant docs
- **Commits**: Use conventional commit format

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Resources

### Documentation
- [README.md](../../README.md) - Main project overview
- [OPENCOG_README.md](../../OPENCOG_README.md) - OpenCog architecture guide
- [QUICKSTART.md](../../QUICKSTART.md) - Quick start guide
- [IMPLEMENTATION_SUMMARY.md](../../IMPLEMENTATION_SUMMARY.md) - Implementation details
- [CHANGELOG.md](../../CHANGELOG.md) - Version history

### External Links
- [Bolt.new Official](https://bolt.new) - Commercial hosted version
- [StackBlitz WebContainer API](https://webcontainers.io/api) - Execution environment
- [OpenCog](https://opencog.org) - Cognitive architecture inspiration
- [Anthropic Claude](https://www.anthropic.com/) - AI provider
- [Remix Framework](https://remix.run/) - Web framework

### Community
- GitHub: [cogpy/cogbolt.new](https://github.com/cogpy/cogbolt.new)
- Issues: [Report bugs and request features](https://github.com/cogpy/cogbolt.new/issues)

---

**CogBolt**: Where cognitive architecture meets AI-powered development, creating a new paradigm for building software through natural language, autonomous agents, and living knowledge graphs—all running natively in your browser. 🧠🤖⚡

/**
 * CogServer Store - OpenCog Terminal Integration
 * Provides a cognitive server interface through the terminal
 */
import { atom, type WritableAtom } from 'nanostores';
import type { ITerminal } from '~/types/terminal';
import { atomSpaceStore } from './atomspace';

export interface CogCommand {
  command: string;
  description: string;
  handler: (args: string[], terminal: ITerminal) => void | Promise<void>;
}

export interface AgentConfig {
  id: string;
  name: string;
  type: 'reasoning' | 'learning' | 'planning' | 'perception';
  active: boolean;
  frequency: number; // cognitive cycles per second
}

export class CogServerStore {
  connected: WritableAtom<boolean> = import.meta.hot?.data.connected ?? atom(false);
  agents: WritableAtom<Map<string, AgentConfig>> = import.meta.hot?.data.agents ?? atom(new Map());
  commandHistory: WritableAtom<string[]> = import.meta.hot?.data.commandHistory ?? atom([]);
  
  private commands: Map<string, CogCommand> = new Map();
  private terminal: ITerminal | null = null;

  constructor() {
    if (import.meta.hot) {
      import.meta.hot.data.connected = this.connected;
      import.meta.hot.data.agents = this.agents;
      import.meta.hot.data.commandHistory = this.commandHistory;
    }

    this.registerDefaultCommands();
  }

  /**
   * Register default CogServer commands
   */
  private registerDefaultCommands() {
    this.registerCommand({
      command: 'help',
      description: 'Show available CogServer commands',
      handler: (args, terminal) => {
        terminal.write('\r\n=== CogServer Commands ===\r\n');
        this.commands.forEach((cmd, name) => {
          terminal.write(`\r\n  ${name.padEnd(20)} - ${cmd.description}`);
        });
        terminal.write('\r\n\r\n');
      },
    });

    this.registerCommand({
      command: 'atoms',
      description: 'List all atoms in AtomSpace',
      handler: (args, terminal) => {
        const atoms = atomSpaceStore.atoms.get();
        const atomList = Object.values(atoms);
        
        terminal.write(`\r\n=== AtomSpace (${atomList.length} atoms) ===\r\n`);
        
        if (args[0] === '-v' || args[0] === '--verbose') {
          atomList.forEach(atom => {
            terminal.write(`\r\n[${atom.type}] ${atom.name} (${atom.id})`);
            terminal.write(`\r\n  TV: strength=${atom.truthValue.strength.toFixed(2)} confidence=${atom.truthValue.confidence.toFixed(2)}`);
            if (atom.outgoing && atom.outgoing.length > 0) {
              terminal.write(`\r\n  Outgoing: ${atom.outgoing.join(', ')}`);
            }
          });
        } else {
          atomList.forEach(atom => {
            terminal.write(`\r\n  [${atom.type}] ${atom.name}`);
          });
        }
        terminal.write('\r\n\r\n');
      },
    });

    this.registerCommand({
      command: 'agents',
      description: 'List active cognitive agents',
      handler: (args, terminal) => {
        const agents = this.agents.get();
        terminal.write(`\r\n=== Active Agents (${agents.size}) ===\r\n`);
        
        agents.forEach((agent, id) => {
          const status = agent.active ? '✓' : '✗';
          terminal.write(`\r\n  ${status} ${agent.name} (${agent.type}) - ${agent.frequency}Hz`);
        });
        terminal.write('\r\n\r\n');
      },
    });

    this.registerCommand({
      command: 'agent',
      description: 'Start/stop an agent: agent start|stop <name>',
      handler: (args, terminal) => {
        if (args.length < 2) {
          terminal.write('\r\nUsage: agent start|stop <name>\r\n\r\n');
          return;
        }

        const action = args[0];
        const agentName = args.slice(1).join(' ');
        const agents = this.agents.get();
        
        const agent = Array.from(agents.values()).find(a => a.name === agentName);
        
        if (!agent) {
          terminal.write(`\r\nAgent '${agentName}' not found\r\n\r\n`);
          return;
        }

        if (action === 'start') {
          agent.active = true;
          terminal.write(`\r\nAgent '${agentName}' started\r\n\r\n`);
        } else if (action === 'stop') {
          agent.active = false;
          terminal.write(`\r\nAgent '${agentName}' stopped\r\n\r\n`);
        } else {
          terminal.write('\r\nInvalid action. Use start or stop\r\n\r\n');
        }
        
        this.agents.set(new Map(agents));
      },
    });

    this.registerCommand({
      command: 'processes',
      description: 'List active cognitive processes',
      handler: (args, terminal) => {
        const processes = atomSpaceStore.processes.get();
        const processList = Object.values(processes);
        
        terminal.write(`\r\n=== Cognitive Processes (${processList.length}) ===\r\n`);
        
        processList.forEach(process => {
          const statusIcon = process.status === 'active' ? '▶' : 
                           process.status === 'paused' ? '⏸' : '✓';
          terminal.write(`\r\n  ${statusIcon} ${process.name} (${process.type})`);
          terminal.write(` - ${process.progress}% complete`);
        });
        terminal.write('\r\n\r\n');
      },
    });

    this.registerCommand({
      command: 'create-atom',
      description: 'Create a new atom: create-atom <type> <name>',
      handler: (args, terminal) => {
        if (args.length < 2) {
          terminal.write('\r\nUsage: create-atom <type> <name>\r\n\r\n');
          return;
        }

        const type = args[0] as any;
        const name = args.slice(1).join(' ');
        
        try {
          const atom = atomSpaceStore.createAtom(type, name);
          terminal.write(`\r\nCreated atom: [${atom.type}] ${atom.name} (${atom.id})\r\n\r\n`);
        } catch (error) {
          terminal.write(`\r\nError creating atom: ${error}\r\n\r\n`);
        }
      },
    });

    this.registerCommand({
      command: 'clear',
      description: 'Clear AtomSpace',
      handler: (args, terminal) => {
        atomSpaceStore.clear();
        terminal.write('\r\nAtomSpace cleared\r\n\r\n');
      },
    });

    this.registerCommand({
      command: 'status',
      description: 'Show CogServer status',
      handler: (args, terminal) => {
        const atoms = Object.keys(atomSpaceStore.atoms.get()).length;
        const processes = Object.keys(atomSpaceStore.processes.get()).length;
        const agents = this.agents.get().size;
        const activeAgents = Array.from(this.agents.get().values()).filter((a) => a.active).length;

        terminal.write('\r\n=== CogServer Status ===\r\n');
        terminal.write(`\r\n  AtomSpace: ${atoms} atoms`);
        terminal.write(`\r\n  Processes: ${processes} active`);
        terminal.write(`\r\n  Agents: ${activeAgents}/${agents} active`);
        terminal.write(`\r\n  Connected: ${this.connected.get() ? 'Yes' : 'No'}`);
        terminal.write('\r\n\r\n');
      },
    });

    this.registerCommand({
      command: 'query',
      description: 'Query AtomSpace using natural language: query <question>',
      handler: (args, terminal) => {
        if (args.length === 0) {
          terminal.write('\r\nUsage: query <question>\r\n');
          terminal.write('\r\nExamples:\r\n');
          terminal.write('  query what files are in the atomspace\r\n');
          terminal.write('  query show me all concepts\r\n');
          terminal.write('  query what processes are running\r\n\r\n');
          return;
        }

        const query = args.join(' ').toLowerCase();
        terminal.write(`\r\n🔍 Processing query: "${query}"\r\n\r\n`);

        // Natural language query processing
        if (query.includes('file') || query.includes('files')) {
          const fileAtoms = atomSpaceStore
            .getAtomsByType('ConceptNode')
            .filter((a) => a.metadata?.fileType === 'file');
          terminal.write(`Found ${fileAtoms.length} file atoms:\r\n`);
          fileAtoms.slice(0, 10).forEach((atom) => {
            terminal.write(`  📄 ${atom.name}\r\n`);
          });

          if (fileAtoms.length > 10) {
            terminal.write(`  ... and ${fileAtoms.length - 10} more\r\n`);
          }
        } else if (query.includes('concept') || query.includes('node')) {
          const concepts = atomSpaceStore.getAtomsByType('ConceptNode');
          terminal.write(`Found ${concepts.length} concept nodes:\r\n`);
          concepts.slice(0, 10).forEach((atom) => {
            terminal.write(`  🧠 ${atom.name} (strength: ${atom.truthValue.strength.toFixed(2)})\r\n`);
          });

          if (concepts.length > 10) {
            terminal.write(`  ... and ${concepts.length - 10} more\r\n`);
          }
        } else if (query.includes('process') || query.includes('running')) {
          const processes = Object.values(atomSpaceStore.processes.get());
          terminal.write(`Found ${processes.length} cognitive processes:\r\n`);
          processes.forEach((proc) => {
            const icon = proc.status === 'active' ? '▶' : proc.status === 'paused' ? '⏸' : '✓';
            terminal.write(`  ${icon} ${proc.name} (${proc.type}) - ${proc.progress}%\r\n`);
          });
        } else if (query.includes('link')) {
          const links = ['InheritanceLink', 'SimilarityLink', 'ImplicationLink', 'EvaluationLink'];
          let totalLinks = 0;
          links.forEach((linkType) => {
            const linkAtoms = atomSpaceStore.getAtomsByType(linkType as any);
            if (linkAtoms.length > 0) {
              terminal.write(`  ${linkType}: ${linkAtoms.length}\r\n`);
              totalLinks += linkAtoms.length;
            }
          });
          terminal.write(`\r\nTotal links: ${totalLinks}\r\n`);
        } else if (query.includes('stat') || query.includes('summary')) {
          const stats = atomSpaceStore.getStatistics();
          terminal.write('=== AtomSpace Statistics ===\r\n');
          terminal.write(`  Total Atoms: ${stats.totalAtoms}\r\n`);
          terminal.write(`  Total Processes: ${stats.totalProcesses}\r\n`);
          terminal.write(`  Active Processes: ${stats.activeProcesses}\r\n`);
          terminal.write(`  Files Mapped: ${stats.filesMapped}\r\n`);
          terminal.write(`  Avg Truth Strength: ${stats.averageTruthStrength.toFixed(3)}\r\n`);
          terminal.write('\r\nAtom Type Distribution:\r\n');
          Object.entries(stats.atomTypeDistribution).forEach(([type, count]) => {
            terminal.write(`  ${type}: ${count}\r\n`);
          });
        } else {
          terminal.write('Could not understand query. Try asking about:\r\n');
          terminal.write('  - files, concepts, processes, links, or statistics\r\n');
        }

        terminal.write('\r\n');
      },
    });

    this.registerCommand({
      command: 'save',
      description: 'Save AtomSpace to storage: save [key]',
      handler: (args, terminal) => {
        const key = args.length > 0 ? args.join('_') : 'atomspace_snapshot';
        const success = atomSpaceStore.saveToLocalStorage(key);

        if (success) {
          const stats = atomSpaceStore.getStatistics();
          terminal.write(`\r\n✅ AtomSpace saved to localStorage (key: ${key})\r\n`);
          terminal.write(`   Saved ${stats.totalAtoms} atoms and ${stats.totalProcesses} processes\r\n\r\n`);
        } else {
          terminal.write('\r\n❌ Failed to save AtomSpace\r\n\r\n');
        }
      },
    });

    this.registerCommand({
      command: 'load',
      description: 'Load AtomSpace from storage: load [key]',
      handler: (args, terminal) => {
        const key = args.length > 0 ? args.join('_') : 'atomspace_snapshot';
        const success = atomSpaceStore.loadFromLocalStorage(key);

        if (success) {
          const stats = atomSpaceStore.getStatistics();
          terminal.write(`\r\n✅ AtomSpace loaded from localStorage (key: ${key})\r\n`);
          terminal.write(`   Loaded ${stats.totalAtoms} atoms and ${stats.totalProcesses} processes\r\n\r\n`);
        } else {
          terminal.write(`\r\n❌ Failed to load AtomSpace from key: ${key}\r\n\r\n`);
        }
      },
    });

    this.registerCommand({
      command: 'export',
      description: 'Export AtomSpace to JSON file',
      handler: (args, terminal) => {
        const jsonData = atomSpaceStore.exportToJSON();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atomspace_export_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        const stats = atomSpaceStore.getStatistics();
        terminal.write(`\r\n📥 Exported ${stats.totalAtoms} atoms to JSON file\r\n\r\n`);
      },
    });

    this.registerCommand({
      command: 'stats',
      description: 'Show detailed AtomSpace statistics',
      handler: (args, terminal) => {
        const stats = atomSpaceStore.getStatistics();
        terminal.write('\r\n=== AtomSpace Statistics ===\r\n');
        terminal.write(`\r\n  Total Atoms: ${stats.totalAtoms}`);
        terminal.write(`\r\n  Total Processes: ${stats.totalProcesses}`);
        terminal.write(`\r\n  Active Processes: ${stats.activeProcesses}`);
        terminal.write(`\r\n  Files Mapped: ${stats.filesMapped}`);
        terminal.write(`\r\n  Average Truth Strength: ${stats.averageTruthStrength.toFixed(3)}`);
        terminal.write('\r\n\r\nAtom Type Distribution:\r\n');
        Object.entries(stats.atomTypeDistribution).forEach(([type, count]) => {
          const percentage = ((count / stats.totalAtoms) * 100).toFixed(1);
          terminal.write(`\r\n  ${type.padEnd(20)} ${count.toString().padStart(5)} (${percentage}%)`);
        });
        terminal.write('\r\n\r\n');
      },
    });
  }

  /**
   * Register a new command
   */
  registerCommand(command: CogCommand) {
    this.commands.set(command.command, command);
  }

  /**
   * Execute a CogServer command
   */
  async executeCommand(commandLine: string, terminal: ITerminal): Promise<void> {
    const parts = commandLine.trim().split(/\s+/);
    const commandName = parts[0];
    const args = parts.slice(1);

    // Add to history
    const history = this.commandHistory.get();
    this.commandHistory.set([...history, commandLine]);

    const command = this.commands.get(commandName);
    
    if (!command) {
      terminal.write(`\r\nUnknown command: ${commandName}\r\n`);
      terminal.write(`Type 'help' for available commands\r\n\r\n`);
      return;
    }

    try {
      await command.handler(args, terminal);
    } catch (error) {
      terminal.write(`\r\nError executing command: ${error}\r\n\r\n`);
    }
  }

  /**
   * Register a cognitive agent
   */
  registerAgent(name: string, type: AgentConfig['type'], frequency: number = 1): string {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const agent: AgentConfig = {
      id,
      name,
      type,
      active: false,
      frequency,
    };

    const agents = this.agents.get();
    agents.set(id, agent);
    this.agents.set(new Map(agents));

    return id;
  }

  /**
   * Activate cognitive agent
   */
  activateAgent(agentId: string) {
    const agents = this.agents.get();
    const agent = agents.get(agentId);
    
    if (agent) {
      agent.active = true;
      this.agents.set(new Map(agents));
    }
  }

  /**
   * Deactivate cognitive agent
   */
  deactivateAgent(agentId: string) {
    const agents = this.agents.get();
    const agent = agents.get(agentId);
    
    if (agent) {
      agent.active = false;
      this.agents.set(new Map(agents));
    }
  }

  /**
   * Connect to terminal
   */
  connect(terminal: ITerminal) {
    this.terminal = terminal;
    this.connected.set(true);
    
    terminal.write('\r\n');
    terminal.write('╔═══════════════════════════════════════════╗\r\n');
    terminal.write('║   OpenCog CogServer v1.0                  ║\r\n');
    terminal.write('║   Cognitive Architecture Terminal         ║\r\n');
    terminal.write('╚═══════════════════════════════════════════╝\r\n');
    terminal.write('\r\n');
    terminal.write('Type "help" for available commands\r\n');
    terminal.write('\r\n');
  }

  /**
   * Disconnect from terminal
   */
  disconnect() {
    this.terminal = null;
    this.connected.set(false);
  }
}

export const cogServerStore = new CogServerStore();

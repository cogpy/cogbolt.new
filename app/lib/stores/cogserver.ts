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

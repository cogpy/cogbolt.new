/**
 * Multi-Agent Orchestration Store
 * Manages autonomous agents and their interactions
 */
import { atom, map, type MapStore, type WritableAtom } from 'nanostores';
import type { Atom, CognitiveProcess } from './atomspace';
import { atomSpaceStore } from './atomspace';

export type AgentRole = 'planner' | 'executor' | 'monitor' | 'learner' | 'coordinator';

export type AgentState = 'idle' | 'thinking' | 'acting' | 'communicating' | 'learning';

export interface Message {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast' | 'notification';
  content: any;
  timestamp: number;
}

export interface AgentMemory {
  shortTerm: Atom[];
  workingMemory: string[]; // Atom IDs
  goals: string[];
}

export interface AutonomousAgent {
  id: string;
  name: string;
  role: AgentRole;
  state: AgentState;
  capabilities: string[];
  memory: AgentMemory;
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
  };
  timestamp: number;
}

export interface AgentTask {
  id: string;
  description: string;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: number;
  result?: any;
  timestamp: number;
}

export interface Collaboration {
  id: string;
  participants: string[]; // Agent IDs
  goal: string;
  status: 'active' | 'completed' | 'failed';
  messages: Message[];
  timestamp: number;
}

export class MultiAgentStore {
  // Agent registry
  agents: MapStore<Record<string, AutonomousAgent>> = import.meta.hot?.data.agents ?? map({});

  // Task queue
  tasks: MapStore<Record<string, AgentTask>> = import.meta.hot?.data.tasks ?? map({});

  // Message bus
  messages: WritableAtom<Message[]> = import.meta.hot?.data.messages ?? atom([]);

  // Collaborations
  collaborations: MapStore<Record<string, Collaboration>> = import.meta.hot?.data.collaborations ?? map({});

  // Orchestration state
  orchestrationActive: WritableAtom<boolean> = import.meta.hot?.data.orchestrationActive ?? atom(false);

  constructor() {
    if (import.meta.hot) {
      import.meta.hot.data.agents = this.agents;
      import.meta.hot.data.tasks = this.tasks;
      import.meta.hot.data.messages = this.messages;
      import.meta.hot.data.collaborations = this.collaborations;
      import.meta.hot.data.orchestrationActive = this.orchestrationActive;
    }

    this.initializeDefaultAgents();
  }

  /**
   * Initialize default cognitive agents
   */
  private initializeDefaultAgents() {
    // Only initialize if no agents exist
    if (Object.keys(this.agents.get()).length === 0) {
      this.createAgent('Strategic Planner', 'planner', ['planning', 'goal-setting', 'strategy']);
      this.createAgent('Code Executor', 'executor', ['code-execution', 'file-operations', 'deployment']);
      this.createAgent('System Monitor', 'monitor', ['monitoring', 'diagnostics', 'reporting']);
      this.createAgent('Knowledge Learner', 'learner', ['learning', 'pattern-recognition', 'adaptation']);
      this.createAgent('Coordination Agent', 'coordinator', ['coordination', 'task-allocation', 'communication']);
    }
  }

  /**
   * Create a new autonomous agent
   */
  createAgent(name: string, role: AgentRole, capabilities: string[]): AutonomousAgent {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const agent: AutonomousAgent = {
      id,
      name,
      role,
      state: 'idle',
      capabilities,
      memory: {
        shortTerm: [],
        workingMemory: [],
        goals: [],
      },
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        avgResponseTime: 0,
      },
      timestamp: Date.now(),
    };

    this.agents.setKey(id, agent);

    // Create a cognitive process for this agent
    atomSpaceStore.createProcess(`Agent: ${name}`, 'reasoning', []);

    return agent;
  }

  /**
   * Update agent state
   */
  updateAgentState(agentId: string, state: AgentState) {
    const agent = this.agents.get()[agentId];

    if (agent) {
      this.agents.setKey(agentId, { ...agent, state });
    }
  }

  /**
   * Assign task to agent
   */
  assignTask(taskId: string, agentId: string) {
    const task = this.tasks.get()[taskId];
    const agent = this.agents.get()[agentId];

    if (task && agent) {
      this.tasks.setKey(taskId, { ...task, assignedTo: agentId, status: 'in-progress' });
      this.agents.setKey(agentId, { ...agent, currentTask: taskId, state: 'acting' });
    }
  }

  /**
   * Create a new task
   */
  createTask(description: string, priority: number = 5): AgentTask {
    const id = `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const task: AgentTask = {
      id,
      description,
      status: 'pending',
      priority,
      timestamp: Date.now(),
    };

    this.tasks.setKey(id, task);

    // Auto-assign to best agent
    this.autoAssignTask(id);

    return task;
  }

  /**
   * Auto-assign task to most suitable agent
   */
  private autoAssignTask(taskId: string) {
    const task = this.tasks.get()[taskId];
    const agents = Object.values(this.agents.get());

    // Find idle agents
    const idleAgents = agents.filter((a) => a.state === 'idle');

    if (idleAgents.length > 0 && task) {
      /*
       * Simple assignment: pick first idle agent
       * In a real system, this would use capability matching
       */
      const selectedAgent = idleAgents[0];
      this.assignTask(taskId, selectedAgent.id);
    }
  }

  /**
   * Complete a task
   */
  completeTask(taskId: string, result?: any) {
    const task = this.tasks.get()[taskId];

    if (task && task.assignedTo) {
      this.tasks.setKey(taskId, { ...task, status: 'completed', result });

      const agent = this.agents.get()[task.assignedTo];

      if (agent) {
        this.agents.setKey(agent.id, {
          ...agent,
          state: 'idle',
          currentTask: undefined,
          performance: {
            ...agent.performance,
            tasksCompleted: agent.performance.tasksCompleted + 1,
          },
        });
      }
    }
  }

  /**
   * Send message between agents
   */
  sendMessage(from: string, to: string, type: Message['type'], content: any) {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      from,
      to,
      type,
      content,
      timestamp: Date.now(),
    };

    const messages = this.messages.get();
    this.messages.set([...messages, message]);

    // Update agent states
    const fromAgent = this.agents.get()[from];
    const toAgent = this.agents.get()[to];

    if (fromAgent) {
      this.updateAgentState(from, 'communicating');
    }

    if (toAgent) {
      this.updateAgentState(to, 'communicating');
    }

    return message;
  }

  /**
   * Create a collaboration between agents
   */
  createCollaboration(participantIds: string[], goal: string): Collaboration {
    const id = `collab_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const collaboration: Collaboration = {
      id,
      participants: participantIds,
      goal,
      status: 'active',
      messages: [],
      timestamp: Date.now(),
    };

    this.collaborations.setKey(id, collaboration);

    return collaboration;
  }

  /**
   * Add message to collaboration
   */
  addCollaborationMessage(collaborationId: string, message: Message) {
    const collab = this.collaborations.get()[collaborationId];

    if (collab) {
      this.collaborations.setKey(collaborationId, {
        ...collab,
        messages: [...collab.messages, message],
      });
    }
  }

  /**
   * Start orchestration
   */
  startOrchestration() {
    this.orchestrationActive.set(true);

    // Initialize agents
    Object.values(this.agents.get()).forEach((agent) => {
      this.updateAgentState(agent.id, 'idle');
    });
  }

  /**
   * Stop orchestration
   */
  stopOrchestration() {
    this.orchestrationActive.set(false);

    // Pause all agents
    Object.values(this.agents.get()).forEach((agent) => {
      this.updateAgentState(agent.id, 'idle');
    });
  }

  /**
   * Get agent by role
   */
  getAgentsByRole(role: AgentRole): AutonomousAgent[] {
    return Object.values(this.agents.get()).filter((a) => a.role === role);
  }

  /**
   * Get active tasks
   */
  getActiveTasks(): AgentTask[] {
    return Object.values(this.tasks.get()).filter((t) => t.status === 'pending' || t.status === 'in-progress');
  }

  /**
   * Get agent statistics
   */
  getAgentStats() {
    const agents = Object.values(this.agents.get());
    const tasks = Object.values(this.tasks.get());

    return {
      totalAgents: agents.length,
      activeAgents: agents.filter((a) => a.state !== 'idle').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'completed').length,
      pendingTasks: tasks.filter((t) => t.status === 'pending').length,
      avgSuccessRate: agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length || 0,
    };
  }
}

export const multiAgentStore = new MultiAgentStore();

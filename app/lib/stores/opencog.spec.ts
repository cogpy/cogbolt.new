import { describe, expect, it, beforeEach } from 'vitest';
import { atomSpaceStore } from './atomspace';
import { multiAgentStore } from './multiagent';

describe('AtomSpace Store', () => {
  beforeEach(() => {
    atomSpaceStore.clear();
  });

  it('should create atoms with correct properties', () => {
    const atom = atomSpaceStore.createAtom('ConceptNode', 'Test Concept');

    expect(atom.type).toBe('ConceptNode');
    expect(atom.name).toBe('Test Concept');
    expect(atom.truthValue.strength).toBe(1.0);
    expect(atom.truthValue.confidence).toBe(1.0);
  });

  it('should link files to atoms', () => {
    const atom = atomSpaceStore.createAtom('ConceptNode', 'test.ts');
    atomSpaceStore.linkFileToAtom('/test.ts', atom.id);

    const fileAtomMap = atomSpaceStore.fileAtomMap.get();

    expect(fileAtomMap['/test.ts']).toBe(atom.id);
  });

  it('should get atoms by type', () => {
    atomSpaceStore.createAtom('ConceptNode', 'Concept 1');
    atomSpaceStore.createAtom('ConceptNode', 'Concept 2');
    atomSpaceStore.createAtom('PredicateNode', 'Predicate 1');

    const conceptNodes = atomSpaceStore.getAtomsByType('ConceptNode');
    const predicateNodes = atomSpaceStore.getAtomsByType('PredicateNode');

    expect(conceptNodes.length).toBe(2);
    expect(predicateNodes.length).toBe(1);
  });

  it('should update truth values', () => {
    const atom = atomSpaceStore.createAtom('ConceptNode', 'Test');
    atomSpaceStore.updateTruthValue(atom.id, { strength: 0.5, confidence: 0.8 });

    const updated = atomSpaceStore.getAtom(atom.id);

    expect(updated?.truthValue.strength).toBe(0.5);
    expect(updated?.truthValue.confidence).toBe(0.8);
  });

  it('should create and track cognitive processes', () => {
    const process = atomSpaceStore.createProcess('Test Process', 'reasoning');

    expect(process.name).toBe('Test Process');
    expect(process.type).toBe('reasoning');
    expect(process.status).toBe('active');
    expect(process.progress).toBe(0);

    atomSpaceStore.updateProcess(process.id, { progress: 50 });

    const processes = atomSpaceStore.processes.get();

    expect(processes[process.id].progress).toBe(50);
  });

  it('should sync files with atomspace', () => {
    const files = {
      '/test.ts': { type: 'file' as const, content: 'test', isBinary: false },
      '/folder': { type: 'folder' as const },
    };

    atomSpaceStore.syncFilesWithAtomSpace(files);

    const atoms = atomSpaceStore.atoms.get();
    const atomsList = Object.values(atoms);

    expect(atomsList.length).toBeGreaterThanOrEqual(2);
    expect(atomsList.some((a) => a.name === '/test.ts')).toBe(true);
    expect(atomsList.some((a) => a.name === '/folder')).toBe(true);
  });
});

describe('Multi-Agent Store', () => {
  it('should initialize with default agents', () => {
    const agents = multiAgentStore.agents.get();
    const agentsList = Object.values(agents);

    expect(agentsList.length).toBe(5);
    expect(agentsList.some((a) => a.name === 'Strategic Planner')).toBe(true);
    expect(agentsList.some((a) => a.name === 'Code Executor')).toBe(true);
  });

  it('should create and assign tasks', () => {
    const task = multiAgentStore.createTask('Test task', 5);

    expect(task.description).toBe('Test task');
    expect(task.priority).toBe(5);
    expect(task.status).toBe('pending');

    // Task should be auto-assigned if agents are idle
    const tasks = multiAgentStore.tasks.get();

    expect(tasks[task.id]).toBeDefined();
  });

  it('should complete tasks and update agent state', () => {
    const task = multiAgentStore.createTask('Test task', 5);

    if (task.assignedTo) {
      multiAgentStore.completeTask(task.id, { result: 'success' });

      const completedTask = multiAgentStore.tasks.get()[task.id];
      const agent = multiAgentStore.agents.get()[task.assignedTo];

      expect(completedTask.status).toBe('completed');
      expect(agent.state).toBe('idle');
      expect(agent.performance.tasksCompleted).toBeGreaterThan(0);
    }
  });

  it('should get agent statistics', () => {
    const stats = multiAgentStore.getAgentStats();

    expect(stats.totalAgents).toBe(5);
    expect(stats.totalTasks).toBeGreaterThanOrEqual(0);
  });

  it('should manage orchestration state', () => {
    expect(multiAgentStore.orchestrationActive.get()).toBe(false);

    multiAgentStore.startOrchestration();
    expect(multiAgentStore.orchestrationActive.get()).toBe(true);

    multiAgentStore.stopOrchestration();
    expect(multiAgentStore.orchestrationActive.get()).toBe(false);
  });
});

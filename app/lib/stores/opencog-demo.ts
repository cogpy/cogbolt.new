/**
 * OpenCog Demo Initialization
 * Demonstrates the cognitive architecture capabilities
 */
import { atomSpaceStore } from './atomspace';
import { cogServerStore } from './cogserver';
import { multiAgentStore } from './multiagent';

export function initializeOpenCogDemo() {
  console.log('🧠 Initializing OpenCog Demo...');

  // 1. Create some demo atoms to show knowledge representation
  createDemoAtoms();

  // 2. Start some demo cognitive processes
  createDemoCognitiveProcesses();

  // 3. Create demo tasks for agents
  createDemoTasks();

  console.log('✅ OpenCog Demo initialized successfully!');
}

function createDemoAtoms() {
  // Create concept nodes for programming concepts
  const webDev = atomSpaceStore.createAtom('ConceptNode', 'Web Development', undefined, { category: 'domain' });

  const react = atomSpaceStore.createAtom('ConceptNode', 'React Framework', undefined, { category: 'technology' });

  const typescript = atomSpaceStore.createAtom('ConceptNode', 'TypeScript', undefined, { category: 'language' });

  // Create inheritance links (React is-a type of Web Development)
  atomSpaceStore.createAtom('InheritanceLink', 'React inherits from Web Development', [react.id, webDev.id], {
    relationship: 'is-a',
  });

  atomSpaceStore.createAtom('InheritanceLink', 'TypeScript inherits from Web Development', [typescript.id, webDev.id], {
    relationship: 'is-a',
  });

  // Create similarity link
  atomSpaceStore.createAtom('SimilarityLink', 'React similar to TypeScript', [react.id, typescript.id], {
    strength: 0.8,
  });

  // Create some predicate nodes
  const hasFeature = atomSpaceStore.createAtom('PredicateNode', 'has-feature', undefined, { type: 'predicate' });

  const componentBased = atomSpaceStore.createAtom('ConceptNode', 'Component-Based Architecture', undefined, {
    category: 'pattern',
  });

  // Create evaluation link (React has feature Component-Based)
  atomSpaceStore.createAtom(
    'EvaluationLink',
    'React has Component-Based Architecture',
    [hasFeature.id, react.id, componentBased.id],
    { confidence: 0.95 },
  );

  console.log('📚 Created demo knowledge graph with 8 atoms');
}

function createDemoCognitiveProcesses() {
  // Create an attention allocation process
  const attentionProcess = atomSpaceStore.createProcess('Attention Allocation', 'attention', []);

  // Update progress to show it's active
  setTimeout(() => {
    atomSpaceStore.updateProcess(attentionProcess.id, { progress: 25 });
  }, 1000);

  setTimeout(() => {
    atomSpaceStore.updateProcess(attentionProcess.id, { progress: 50 });
  }, 2000);

  setTimeout(() => {
    atomSpaceStore.updateProcess(attentionProcess.id, { progress: 75 });
  }, 3000);

  // Create a pattern learning process
  const learningProcess = atomSpaceStore.createProcess('Pattern Recognition', 'learning', []);

  setTimeout(() => {
    atomSpaceStore.updateProcess(learningProcess.id, { progress: 30 });
  }, 1500);

  // Create a reasoning process
  const reasoningProcess = atomSpaceStore.createProcess('Logical Inference', 'reasoning', []);

  setTimeout(() => {
    atomSpaceStore.updateProcess(reasoningProcess.id, { progress: 60 });
  }, 2500);

  console.log('⚡ Created 3 cognitive processes');
}

function createDemoTasks() {
  // Create some tasks that will be auto-assigned to agents
  multiAgentStore.createTask('Analyze project structure and dependencies', 8);

  setTimeout(() => {
    multiAgentStore.createTask('Optimize code performance', 7);
  }, 1000);

  setTimeout(() => {
    multiAgentStore.createTask('Generate documentation', 5);
  }, 2000);

  setTimeout(() => {
    multiAgentStore.createTask('Monitor system health', 6);
  }, 3000);

  // Simulate some task completions
  setTimeout(() => {
    const tasks = Object.values(multiAgentStore.tasks.get());

    if (tasks.length > 0) {
      const firstTask = tasks[0];

      if (firstTask.status === 'in-progress') {
        multiAgentStore.completeTask(firstTask.id, {
          success: true,
          summary: 'Project structure analyzed successfully',
        });
      }
    }
  }, 5000);

  console.log('📋 Created demo task queue');
}

/**
 * Initialize demo on workbench open
 */
export function initializeOnWorkbenchOpen() {
  // Only initialize demo once per session
  if (typeof window !== 'undefined' && !(window as any).__openCogDemoInitialized) {
    (window as any).__openCogDemoInitialized = true;

    // Wait a bit for the UI to load
    setTimeout(() => {
      initializeOpenCogDemo();
    }, 2000);
  }
}

/**
 * Clear demo data
 */
export function clearOpenCogDemo() {
  atomSpaceStore.clear();
  console.log('🗑️ Demo data cleared');
}

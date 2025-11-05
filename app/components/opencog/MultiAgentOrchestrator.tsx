import { useStore } from '@nanostores/react';
import { memo, useMemo } from 'react';
import { multiAgentStore, type AutonomousAgent, type AgentTask } from '~/lib/stores/multiagent';

export const MultiAgentOrchestrator = memo(() => {
  const agents = useStore(multiAgentStore.agents);
  const tasks = useStore(multiAgentStore.tasks);
  const orchestrationActive = useStore(multiAgentStore.orchestrationActive);

  const agentsList = useMemo(() => Object.values(agents), [agents]);
  const tasksList = useMemo(() => Object.values(tasks), [tasks]);
  const stats = useMemo(() => multiAgentStore.getAgentStats(), [agents, tasks]);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'acting':
        return 'text-green-400';
      case 'thinking':
        return 'text-blue-400';
      case 'communicating':
        return 'text-purple-400';
      case 'learning':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'planner':
        return '📋';
      case 'executor':
        return '⚡';
      case 'monitor':
        return '👁';
      case 'learner':
        return '🎓';
      case 'coordinator':
        return '🎯';
      default:
        return '🤖';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const toggleOrchestration = () => {
    if (orchestrationActive) {
      multiAgentStore.stopOrchestration();
    } else {
      multiAgentStore.startOrchestration();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bolt-elements-background-depth-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bolt-elements-borderColor">
        <h2 className="text-lg font-semibold text-bolt-elements-textPrimary">
          Multi-Agent Orchestration
        </h2>
        <button
          onClick={toggleOrchestration}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            orchestrationActive
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
          }`}
        >
          {orchestrationActive ? '● Active' : '○ Inactive'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-4 border-b border-bolt-elements-borderColor">
        <div className="p-2 bg-bolt-elements-background-depth-3 rounded border border-bolt-elements-borderColor">
          <div className="text-xs text-bolt-elements-textSecondary">Active Agents</div>
          <div className="text-lg font-semibold text-bolt-elements-textPrimary">
            {stats.activeAgents}/{stats.totalAgents}
          </div>
        </div>
        <div className="p-2 bg-bolt-elements-background-depth-3 rounded border border-bolt-elements-borderColor">
          <div className="text-xs text-bolt-elements-textSecondary">Tasks</div>
          <div className="text-lg font-semibold text-bolt-elements-textPrimary">
            {stats.completedTasks}/{stats.totalTasks}
          </div>
        </div>
        <div className="p-2 bg-bolt-elements-background-depth-3 rounded border border-bolt-elements-borderColor">
          <div className="text-xs text-bolt-elements-textSecondary">Success Rate</div>
          <div className="text-lg font-semibold text-bolt-elements-textPrimary">
            {(stats.avgSuccessRate * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Agents Section */}
        <div className="p-4 border-b border-bolt-elements-borderColor">
          <h3 className="text-sm font-semibold text-bolt-elements-textPrimary mb-3">
            Autonomous Agents
          </h3>
          <div className="space-y-2">
            {agentsList.map(agent => (
              <div
                key={agent.id}
                className="p-3 bg-bolt-elements-background-depth-3 rounded border border-bolt-elements-borderColor"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getRoleIcon(agent.role)}</span>
                    <div>
                      <div className="text-sm font-medium text-bolt-elements-textPrimary">
                        {agent.name}
                      </div>
                      <div className="text-xs text-bolt-elements-textSecondary">
                        {agent.role}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${getStateColor(agent.state)}`}>
                    {agent.state}
                  </span>
                </div>
                
                {agent.currentTask && (
                  <div className="mt-2 pt-2 border-t border-bolt-elements-borderColor">
                    <div className="text-xs text-bolt-elements-textSecondary">
                      Current Task: {tasks[agent.currentTask]?.description || 'Unknown'}
                    </div>
                  </div>
                )}
                
                <div className="mt-2 flex items-center gap-3 text-xs text-bolt-elements-textTertiary">
                  <span>✓ {agent.performance.tasksCompleted} tasks</span>
                  <span>• {agent.capabilities.length} capabilities</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-bolt-elements-textPrimary mb-3">
            Task Queue
          </h3>
          {tasksList.length > 0 ? (
            <div className="space-y-2">
              {tasksList.map(task => (
                <div
                  key={task.id}
                  className={`p-3 rounded border ${getTaskStatusColor(task.status)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium flex-1">
                      {task.description}
                    </div>
                    <span className="text-xs ml-2">
                      P{task.priority}
                    </span>
                  </div>
                  {task.assignedTo && agents[task.assignedTo] && (
                    <div className="text-xs mt-1 opacity-75">
                      Assigned to: {agents[task.assignedTo].name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-bolt-elements-textSecondary">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm">No tasks in queue</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MultiAgentOrchestrator.displayName = 'MultiAgentOrchestrator';

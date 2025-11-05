/**
 * OpenCog Workbench Integration
 * Extends the standard workbench with OpenCog cognitive architecture components
 */
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { AtomSpaceViewer } from '../opencog/AtomSpaceViewer';
import { MultiAgentOrchestrator } from '../opencog/MultiAgentOrchestrator';

export type OpenCogPanelType = 'atomspace' | 'agents' | 'none';

export const OpenCogPanel = memo(() => {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const [selectedPanel, setSelectedPanel] = useState<OpenCogPanelType>('atomspace');

  if (!showWorkbench) {
    return null;
  }

  return (
    <div className="fixed top-[calc(var(--header-height)+1.5rem)] right-4 bottom-6 w-80 z-50">
      <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-lg rounded-lg overflow-hidden">
        {/* Panel Tabs */}
        <div className="flex border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-1">
          <button
            onClick={() => setSelectedPanel('atomspace')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              selectedPanel === 'atomspace'
                ? 'text-bolt-elements-textPrimary bg-bolt-elements-background-depth-2 border-b-2 border-bolt-elements-borderColorActive'
                : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
            }`}
          >
            🧠 AtomSpace
          </button>
          <button
            onClick={() => setSelectedPanel('agents')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              selectedPanel === 'agents'
                ? 'text-bolt-elements-textPrimary bg-bolt-elements-background-depth-2 border-b-2 border-bolt-elements-borderColorActive'
                : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
            }`}
          >
            🤖 Agents
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={selectedPanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {selectedPanel === 'atomspace' && <AtomSpaceViewer />}
            {selectedPanel === 'agents' && <MultiAgentOrchestrator />}
          </motion.div>
        </div>
      </div>
    </div>
  );
});

OpenCogPanel.displayName = 'OpenCogPanel';

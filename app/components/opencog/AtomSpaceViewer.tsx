import { useStore } from '@nanostores/react';
import { memo, useMemo } from 'react';
import { atomSpaceStore, type Atom, type AtomType } from '~/lib/stores/atomspace';

interface AtomSpaceViewerProps {
  onAtomSelect?: (atom: Atom) => void;
}

export const AtomSpaceViewer = memo(({ onAtomSelect }: AtomSpaceViewerProps) => {
  const atoms = useStore(atomSpaceStore.atoms);
  const processes = useStore(atomSpaceStore.processes);

  const atomsList = useMemo(() => Object.values(atoms), [atoms]);
  const processesList = useMemo(() => Object.values(processes), [processes]);

  const atomsByType = useMemo(() => {
    const grouped: Record<string, Atom[]> = {};
    atomsList.forEach(atom => {
      if (!grouped[atom.type]) {
        grouped[atom.type] = [];
      }
      grouped[atom.type].push(atom);
    });
    return grouped;
  }, [atomsList]);

  const getTruthValueColor = (strength: number, confidence: number) => {
    const value = strength * confidence;
    if (value > 0.8) return 'text-green-400';
    if (value > 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProcessStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '▶';
      case 'paused':
        return '⏸';
      case 'completed':
        return '✓';
      default:
        return '○';
    }
  };

  return (
    <div className="flex flex-col h-full bg-bolt-elements-background-depth-2 border-l border-bolt-elements-borderColor">
      <div className="flex items-center justify-between px-4 py-3 border-b border-bolt-elements-borderColor">
        <h2 className="text-lg font-semibold text-bolt-elements-textPrimary">
          AtomSpace
        </h2>
        <div className="flex items-center gap-2 text-sm text-bolt-elements-textSecondary">
          <span>{atomsList.length} atoms</span>
          <span>•</span>
          <span>{processesList.length} processes</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Cognitive Processes Section */}
        {processesList.length > 0 && (
          <div className="p-4 border-b border-bolt-elements-borderColor">
            <h3 className="text-sm font-semibold text-bolt-elements-textPrimary mb-2">
              Cognitive Processes
            </h3>
            <div className="space-y-2">
              {processesList.map(process => (
                <div
                  key={process.id}
                  className="p-2 bg-bolt-elements-background-depth-3 rounded border border-bolt-elements-borderColor"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{getProcessStatusIcon(process.status)}</span>
                      <span className="text-sm font-medium text-bolt-elements-textPrimary">
                        {process.name}
                      </span>
                    </div>
                    <span className="text-xs text-bolt-elements-textSecondary">
                      {process.type}
                    </span>
                  </div>
                  {process.status === 'active' && (
                    <div className="mt-2">
                      <div className="h-1 bg-bolt-elements-background-depth-1 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${process.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-bolt-elements-textSecondary mt-1">
                        {process.progress}% complete
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Atoms by Type Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-bolt-elements-textPrimary mb-2">
            Atoms by Type
          </h3>
          {Object.entries(atomsByType).map(([type, typeAtoms]) => (
            <div key={type} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-bolt-elements-textSecondary">
                  {type}
                </h4>
                <span className="text-xs text-bolt-elements-textTertiary">
                  {typeAtoms.length}
                </span>
              </div>
              <div className="space-y-1">
                {typeAtoms.map(atom => (
                  <div
                    key={atom.id}
                    onClick={() => onAtomSelect?.(atom)}
                    className="p-2 bg-bolt-elements-background-depth-3 rounded border border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-bolt-elements-textPrimary truncate flex-1">
                        {atom.name}
                      </span>
                      <span
                        className={`text-xs font-mono ml-2 ${getTruthValueColor(
                          atom.truthValue.strength,
                          atom.truthValue.confidence
                        )}`}
                      >
                        {atom.truthValue.strength.toFixed(2)}
                      </span>
                    </div>
                    {atom.outgoing && atom.outgoing.length > 0 && (
                      <div className="mt-1 text-xs text-bolt-elements-textTertiary">
                        → {atom.outgoing.length} links
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {atomsList.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-bolt-elements-textSecondary">
              <div className="text-4xl mb-2">🧠</div>
              <div className="text-sm">No atoms in AtomSpace</div>
              <div className="text-xs mt-1">Create files or use CogServer to add atoms</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

AtomSpaceViewer.displayName = 'AtomSpaceViewer';

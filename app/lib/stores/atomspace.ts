/**
 * AtomSpace Store - OpenCog Knowledge Representation
 * Manages atoms, their relationships, and truth values for cognitive processing
 */
import { atom, map, type MapStore, type WritableAtom } from 'nanostores';
import type { FileMap } from './files';

export type TruthValue = {
  strength: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
};

export type AtomType =
  | 'ConceptNode'
  | 'PredicateNode'
  | 'VariableNode'
  | 'ListLink'
  | 'EvaluationLink'
  | 'InheritanceLink'
  | 'SimilarityLink'
  | 'ImplicationLink'
  | 'ExecutionLink';

export interface Atom {
  id: string;
  type: AtomType;
  name: string;
  truthValue: TruthValue;
  outgoing?: string[]; // IDs of atoms this links to
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface CognitiveProcess {
  id: string;
  name: string;
  type: 'attention' | 'reasoning' | 'learning' | 'planning';
  status: 'active' | 'paused' | 'completed';
  targetAtoms: string[];
  progress: number;
  timestamp: number;
}

export interface AtomSpaceExport {
  version: string;
  timestamp: number;
  atoms: Record<string, Atom>;
  processes: Record<string, CognitiveProcess>;
  fileAtomMap: Record<string, string>;
  metadata: {
    totalAtoms: number;
    totalProcesses: number;
    atomTypes: AtomType[];
  };
}

export class AtomSpaceStore {
  // Core AtomSpace storage
  atoms: MapStore<Record<string, Atom>> = import.meta.hot?.data.atoms ?? map({});

  // Cognitive processes
  processes: MapStore<Record<string, CognitiveProcess>> = import.meta.hot?.data.processes ?? map({});

  // Index for quick lookups
  atomsByType: WritableAtom<Map<AtomType, Set<string>>> = import.meta.hot?.data.atomsByType ?? atom(new Map());

  atomsByName: WritableAtom<Map<string, string>> = import.meta.hot?.data.atomsByName ?? atom(new Map());

  // File-to-Atom mappings
  fileAtomMap: MapStore<Record<string, string>> = import.meta.hot?.data.fileAtomMap ?? map({});

  constructor() {
    if (import.meta.hot) {
      import.meta.hot.data.atoms = this.atoms;
      import.meta.hot.data.processes = this.processes;
      import.meta.hot.data.atomsByType = this.atomsByType;
      import.meta.hot.data.atomsByName = this.atomsByName;
      import.meta.hot.data.fileAtomMap = this.fileAtomMap;
    }
  }

  /**
   * Create a new atom in the AtomSpace
   */
  createAtom(type: AtomType, name: string, outgoing?: string[], metadata?: Record<string, any>): Atom {
    const id = `atom_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const atom: Atom = {
      id,
      type,
      name,
      truthValue: { strength: 1.0, confidence: 1.0 },
      outgoing,
      metadata,
      timestamp: Date.now(),
    };

    this.atoms.setKey(id, atom);

    // Update indices
    const byType = this.atomsByType.get();

    if (!byType.has(type)) {
      byType.set(type, new Set());
    }

    byType.get(type)!.add(id);
    this.atomsByType.set(byType);

    const byName = this.atomsByName.get();
    byName.set(name, id);
    this.atomsByName.set(byName);

    return atom;
  }

  /**
   * Link a file to an atom for knowledge integration
   */
  linkFileToAtom(filePath: string, atomId: string) {
    this.fileAtomMap.setKey(filePath, atomId);
  }

  /**
   * Get atom by ID
   */
  getAtom(id: string): Atom | undefined {
    return this.atoms.get()[id];
  }

  /**
   * Get all atoms of a specific type
   */
  getAtomsByType(type: AtomType): Atom[] {
    const ids = this.atomsByType.get().get(type) || new Set();
    return Array.from(ids)
      .map((id) => this.atoms.get()[id])
      .filter(Boolean);
  }

  /**
   * Update atom truth value
   */
  updateTruthValue(atomId: string, truthValue: Partial<TruthValue>) {
    const atom = this.getAtom(atomId);

    if (atom) {
      const updated = {
        ...atom,
        truthValue: { ...atom.truthValue, ...truthValue },
      };
      this.atoms.setKey(atomId, updated);
    }
  }

  /**
   * Create a cognitive process
   */
  createProcess(name: string, type: CognitiveProcess['type'], targetAtoms: string[] = []): CognitiveProcess {
    const id = `process_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const process: CognitiveProcess = {
      id,
      name,
      type,
      status: 'active',
      targetAtoms,
      progress: 0,
      timestamp: Date.now(),
    };

    this.processes.setKey(id, process);

    return process;
  }

  /**
   * Update process status
   */
  updateProcess(processId: string, updates: Partial<CognitiveProcess>) {
    const process = this.processes.get()[processId];

    if (process) {
      this.processes.setKey(processId, { ...process, ...updates });
    }
  }

  /**
   * Sync files with AtomSpace - create atoms for file structure
   */
  syncFilesWithAtomSpace(files: FileMap) {
    Object.entries(files).forEach(([path, dirent]) => {
      if (dirent?.type === 'file') {
        // Create or update atom for this file
        const existingAtomId = this.fileAtomMap.get()[path];

        if (!existingAtomId) {
          const fileAtom = this.createAtom('ConceptNode', path, undefined, {
            fileType: 'file',
            content: dirent.content,
          });
          this.linkFileToAtom(path, fileAtom.id);
        }
      } else if (dirent?.type === 'folder') {
        // Create atom for folder
        const existingAtomId = this.fileAtomMap.get()[path];

        if (!existingAtomId) {
          const folderAtom = this.createAtom('ConceptNode', path, undefined, {
            fileType: 'folder',
          });
          this.linkFileToAtom(path, folderAtom.id);
        }
      }
    });
  }

  /**
   * Clear all atoms (useful for reset)
   */
  clear() {
    this.atoms.set({});
    this.processes.set({});
    this.atomsByType.set(new Map());
    this.atomsByName.set(new Map());
    this.fileAtomMap.set({});
  }

  /**
   * Export AtomSpace to JSON for persistence
   */
  exportToJSON(): string {
    const exportData: AtomSpaceExport = {
      version: '1.0.0',
      timestamp: Date.now(),
      atoms: this.atoms.get(),
      processes: this.processes.get(),
      fileAtomMap: this.fileAtomMap.get(),
      metadata: {
        totalAtoms: Object.keys(this.atoms.get()).length,
        totalProcesses: Object.keys(this.processes.get()).length,
        atomTypes: Array.from(this.atomsByType.get().keys()),
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import AtomSpace from JSON
   */
  importFromJSON(jsonData: string): boolean {
    try {
      const data: AtomSpaceExport = JSON.parse(jsonData);

      // Validate version compatibility
      if (data.version !== '1.0.0') {
        console.warn('AtomSpace version mismatch, attempting to import anyway');
      }

      // Clear existing data
      this.clear();

      // Import atoms
      if (data.atoms) {
        this.atoms.set(data.atoms);

        // Rebuild indices
        const byType = new Map<AtomType, Set<string>>();
        const byName = new Map<string, string>();

        Object.values(data.atoms).forEach((atom) => {
          if (!byType.has(atom.type)) {
            byType.set(atom.type, new Set());
          }
          byType.get(atom.type)!.add(atom.id);
          byName.set(atom.name, atom.id);
        });

        this.atomsByType.set(byType);
        this.atomsByName.set(byName);
      }

      // Import processes
      if (data.processes) {
        this.processes.set(data.processes);
      }

      // Import file mappings
      if (data.fileAtomMap) {
        this.fileAtomMap.set(data.fileAtomMap);
      }

      return true;
    } catch (error) {
      console.error('Failed to import AtomSpace:', error);
      return false;
    }
  }

  /**
   * Save AtomSpace to local storage
   */
  saveToLocalStorage(key: string = 'atomspace_snapshot'): boolean {
    try {
      const jsonData = this.exportToJSON();
      localStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error('Failed to save AtomSpace to localStorage:', error);
      return false;
    }
  }

  /**
   * Load AtomSpace from local storage
   */
  loadFromLocalStorage(key: string = 'atomspace_snapshot'): boolean {
    try {
      const jsonData = localStorage.getItem(key);

      if (!jsonData) {
        console.warn('No AtomSpace snapshot found in localStorage');
        return false;
      }

      return this.importFromJSON(jsonData);
    } catch (error) {
      console.error('Failed to load AtomSpace from localStorage:', error);
      return false;
    }
  }

  /**
   * Auto-save AtomSpace periodically
   */
  enableAutoSave(intervalMs: number = 60000): () => void {
    const intervalId = setInterval(() => {
      this.saveToLocalStorage('atomspace_autosave');
    }, intervalMs);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  /**
   * Get statistics about the AtomSpace
   */
  getStatistics() {
    const atoms = this.atoms.get();
    const processes = this.processes.get();
    const byType = this.atomsByType.get();

    const typeDistribution: Record<string, number> = {};

    byType.forEach((ids, type) => {
      typeDistribution[type] = ids.size;
    });

    return {
      totalAtoms: Object.keys(atoms).length,
      totalProcesses: Object.keys(processes).length,
      atomTypeDistribution: typeDistribution,
      activeProcesses: Object.values(processes).filter((p) => p.status === 'active').length,
      averageTruthStrength:
        Object.values(atoms).reduce((sum, atom) => sum + atom.truthValue.strength, 0) /
        Math.max(Object.keys(atoms).length, 1),
      filesMapped: Object.keys(this.fileAtomMap.get()).length,
    };
  }
}

export const atomSpaceStore = new AtomSpaceStore();

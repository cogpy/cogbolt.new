/**
 * CogServer Terminal Integration
 * Wraps the terminal with CogServer command processing capabilities
 */
import type { Terminal as XTerm } from '@xterm/xterm';
import { useEffect, useRef, useState } from 'react';
import { cogServerStore } from '~/lib/stores/cogserver';

interface CogServerTerminalProps {
  terminal: XTerm | null;
}

export function useCogServerTerminal({ terminal }: CogServerTerminalProps) {
  const [commandBuffer, setCommandBuffer] = useState('');
  const [cogMode, setCogMode] = useState(false);
  const inputHandlerRef = useRef<((data: string) => void) | null>(null);

  useEffect(() => {
    if (!terminal) {
      return;
    }

    // Create input handler for CogServer commands
    const handleInput = (data: string) => {
      // Check for CogServer mode toggle (Ctrl+G)
      if (data === '\x07') {
        // Ctrl+G
        setCogMode((prev) => !prev);

        if (!cogMode) {
          terminal.write('\r\n\x1b[33m[CogServer Mode ON - Type "exit" to return]\x1b[0m\r\n');
          cogServerStore.connect(terminal);
          terminal.write('cog> ');
        } else {
          terminal.write('\r\n\x1b[33m[CogServer Mode OFF]\x1b[0m\r\n');
          cogServerStore.disconnect();
        }

        setCommandBuffer('');

        return;
      }

      if (!cogMode) {
        return; // Let normal terminal handle input
      }

      // Handle input in CogServer mode
      if (data === '\r' || data === '\n') {
        // Enter key
        terminal.write('\r\n');

        const command = commandBuffer.trim();

        if (command === 'exit') {
          setCogMode(false);
          terminal.write('\x1b[33m[CogServer Mode OFF]\x1b[0m\r\n');
          cogServerStore.disconnect();
          setCommandBuffer('');

          return;
        }

        if (command) {
          cogServerStore.executeCommand(command, terminal).then(() => {
            terminal.write('cog> ');
          });
        } else {
          terminal.write('cog> ');
        }

        setCommandBuffer('');
      } else if (data === '\x7F' || data === '\b') {
        // Backspace
        if (commandBuffer.length > 0) {
          setCommandBuffer((prev) => prev.slice(0, -1));
          terminal.write('\b \b');
        }
      } else if (data === '\x03') {
        // Ctrl+C
        terminal.write('^C\r\n');
        setCommandBuffer('');
        terminal.write('cog> ');
      } else if (data >= ' ' && data <= '~') {
        // Printable characters
        setCommandBuffer((prev) => prev + data);
        terminal.write(data);
      }
    };

    inputHandlerRef.current = handleInput;

    // Register the input handler
    const disposable = terminal.onData(handleInput);

    return () => {
      disposable.dispose();
      cogServerStore.disconnect();
    };
  }, [terminal, cogMode, commandBuffer]);

  return {
    cogMode,
    toggleCogMode: () => {
      if (terminal) {
        terminal.write('\x07'); // Simulate Ctrl+G
      }
    },
  };
}

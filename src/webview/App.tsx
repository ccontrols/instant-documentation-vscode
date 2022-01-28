import React, { useEffect, useState } from 'react';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { DocumentationNode } from '@structured-types/api-docs/dist/types';
import { VSCodeAPI } from './VSCodeApi';
import { renderNodes } from './nodeToReact';

import { Flex } from './components/Flex';

export const App: React.FC = () => {
  const [nodes, setNodes] = useState<DocumentationNode[] | undefined>(
    VSCodeAPI.getState('nodes'),
  );
  useEffect(() => {
    return VSCodeAPI.onMessage((message) => {
      setNodes(message.data);
      VSCodeAPI.setState({ key: 'nodes', value: message.data });
    });
  });
  return (
    <section>
      {nodes ? (
        renderNodes(nodes)
      ) : (
        <Flex>
          <VSCodeProgressRing />
        </Flex>
      )}
    </section>
  );
};

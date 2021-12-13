import reactPlugin from '@structured-types/react-plugin';
import propTypesPlugin from '@structured-types/prop-types-plugin';
import { DocsOptions, parseFiles } from '@structured-types/api';
import {
  propsToDocumentation,
  apiDocsConfig,
  DocumentationOptions,
  mergeConfig,
  DocumentationNode,
} from '@structured-types/api-docs';
import { getFS } from './fs';

export const extractProps = async (
  fileName: string,
  options: DocsOptions & DocumentationOptions = {},
): Promise<DocumentationNode[]> => {
  const fs = getFS(fileName);
  const { config } = (await apiDocsConfig(fileName, undefined, { fs })) || {};
  const mergedConfig = mergeConfig(config, options);
  const props = parseFiles([fileName], {
    collectSourceInfo: true,
    collectHelpers: false,
    collectInnerLocations: true,
    collectExtension: true,
    plugins: [propTypesPlugin, reactPlugin],
    ...mergedConfig,
  });

  const nodes = await propsToDocumentation(props, {
    ...mergedConfig,
    fs,
  });
  return nodes;
};

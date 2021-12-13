import * as vscode from 'vscode';
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

export const extractProps = async (
  fileName: string,
  options: DocsOptions & DocumentationOptions = {},
): Promise<DocumentationNode[]> => {
  const { config } = (await apiDocsConfig(fileName)) || {};
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
    fs: {
      readDirectory: async (path: string): Promise<string[]> => {
        const result = await vscode.workspace.fs.readDirectory(
          vscode.Uri.file(path),
        );
        return result.map((r) => r[0]);
      },
      fileExists: async (filePath: string): Promise<boolean> => {
        const fstat = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
        return (
          fstat.type === vscode.FileType.File ||
          fstat.type === vscode.FileType.Directory
        );
      },
      readFile: async (filePath: string): Promise<string | null> => {
        return await vscode.workspace.fs
          .readFile(vscode.Uri.file(filePath))
          .toString();
      },
      cwd: (): string | undefined => {
        const tasks = vscode.tasks.taskExecutions;
        if (tasks.length && tasks[0].task.execution) {
          const taskExecution = tasks[0].task.execution;
          if ('options' in taskExecution) {
            return taskExecution.options.cwd;
          }
        }
      },
    },
  });
  return nodes;
};

import * as vscode from 'vscode';
import { STFS } from '@structured-types/api-docs';

export const getFS = (file: string): STFS => ({
  readDirectory: async (path: string): Promise<string[]> => {
    const result = await vscode.workspace.fs.readDirectory(
      vscode.Uri.file(path),
    );
    return result.map((r) => r[0]);
  },
  fileExists: async (filePath: string): Promise<boolean> => {
    try {
      const fstat = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
      return (
        fstat.type === vscode.FileType.File ||
        fstat.type === vscode.FileType.Directory
      );
    } catch (e) {
      return false;
    }
  },

  readFile: async (filePath: string): Promise<string | null> => {
    try {
      const data = await vscode.workspace.fs.readFile(
        vscode.Uri.file(filePath),
      );
      return await data.toString();
    } catch (e) {
      return null;
    }
  },
  cwd: (): string | undefined => {
    const workspace = vscode.workspace.getWorkspaceFolder(
      vscode.Uri.file(file),
    );
    return workspace.uri.path;
  },
});

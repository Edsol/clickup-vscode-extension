import { tokenService } from './service';
import * as vscode from 'vscode';

export async function showInput() {
  const token = await vscode.window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: 'Paste your Clickup Personal Access Token...',
    });

    if (!token) return;

    await tokenService.setToken(token);
}
import { tokenService } from './service';
import * as vscode from 'vscode';

export async function setToken() {
  const token = await vscode.window.showInputBox({
    ignoreFocusOut: true,
    placeHolder: 'Paste your Clickup Personal Access Token...',
  });

  if (!token) {
    return;
  }

  return await tokenService.setToken(token);
}

export async function getToken() {
  var token = await tokenService.getToken();
  return token;
}
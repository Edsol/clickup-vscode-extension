import { LocalStorageService } from './localStorageService';
import * as vscode from 'vscode';
import * as constants from '../constants';
import * as l10n from '@vscode/l10n';

export default class TokenManager {
    storageManager?: LocalStorageService;
    token?: string = undefined;
    regex = /^[a-z]{2}[_]\d+[_].{32}/g;

    constructor(storageManager: LocalStorageService) {
        this.storageManager = storageManager;

    }

    async init(): Promise<string | undefined> {
        this.token = await this.getToken();
        if (await this.isValid()) {
            return this.token;
        }

        return undefined;
    }

    async askToken() {
        const token = await vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Paste your Clickup Personal Access Token...',
        });

        if (!token) {
            return;
        }

        return await this.setToken(token);
    }

    async setToken(token: string | undefined): Promise<boolean> {
        this.storageManager?.setValue('token', token);
        return true;
    }

    async getToken(): Promise<string> {
        return await this.storageManager?.getValue('token');
    }

    async hasToken() {
        const token = await this.getToken();
        if (token) {
            return true;
        }
        return false;
    }

    async delete() {
        const response = await this.storageManager?.setValue('token', undefined);
        return true;
    }

    async isValid() {
        // If token doesn't exists show error message
        if (this.token === undefined) {
            vscode.window.showInformationMessage(constants.NO_CLICKUP_TOKEN_SET);
            return false;
        }

        if (this.token.match(this.regex) === null) {
            vscode.window.showInformationMessage(l10n.t('Invalid Token!'));
            return false;
        }

        return true;
    }
}


'use strict';

import { Memento } from "vscode";

export class LocalStorageService {

    constructor(private storage: Memento) { }

    public async getValue(key: string): Promise<any> {
        return await this.storage.get(key);
    }

    public async setValue<T>(key: string, value: T) {
        await this.storage.update(key, value);
        //TODO: check response of update
        return true;
    }
}
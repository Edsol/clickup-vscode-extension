import { LocalStorageService } from '../localStorageService';

export class TokenService {
    storageManager?: LocalStorageService;

    init(storageManager: LocalStorageService): void {
        this.storageManager = storageManager;
    }

    async setToken(token: String | undefined): Promise<boolean> {
        this.storageManager?.setValue('token', token);
        return true;
    }

    async getToken() {
        return this.storageManager?.getValue('token');
    }

    async hasToken() {
        var token = await this.getToken();
        if (token) {
            return true;
        } else {
            return false;
        }
    }

    async delete() {
        this.storageManager?.setValue('token', undefined);
    }
}

export const tokenService: TokenService = new TokenService();


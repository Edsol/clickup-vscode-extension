export class TokenService {
    async setToken(token: String | undefined): Promise<void>{
        console.log('setToken func',token)
    }
}

export const tokenService: TokenService = new TokenService();


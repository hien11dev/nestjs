export class TokenResponse {
    accessToken: string;
    constructor(accessToken: string) {
        Object.assign(this, { accessToken });
    }
}

export class SuccessResponse {
    success: boolean;
    constructor(success: boolean) {
        Object.assign(this, { success });
    }
}

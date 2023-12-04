export interface TokenResponse {
    accessToken: string
}
export interface SuccessResponse {
    success: boolean
}

export interface JwtPayload {
    id: number,
    email: string,
    createdAt: number
}

export interface VerifyEmailJobData {
    email: string
}

export interface ForgotPasswordJobData extends VerifyEmailJobData { }
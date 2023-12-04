import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export interface PaginateMeta {
    page: number,
    limit: number,
    total: number
}
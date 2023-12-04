import { Category } from "@prisma/client";
import { PaginateMeta } from "src/types";

export class CategoryPaginate {
    data: Category[];
    meta: PaginateMeta;
}


export function categoryPaginateResponse(data: Category[], page: number, limit: number, total: number): CategoryPaginate {
    return {
        data,
        meta: {
            page,
            limit,
            total
        }
    }
}
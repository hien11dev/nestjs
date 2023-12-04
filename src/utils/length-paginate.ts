import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class LengthPaginate {
    page: number;
    get skip(): number {
        return (this.page - 1) * this.take;
    }
    take: number;

    constructor(query: BaseQueryPaginate) {
        Object.assign(this, {
            page: Number(query.page) > 1 ? +query.page : 1,
            take: Number(query.limit) > 0 ? +query.limit : 10,
        });
    }
}

export interface PaginateMeta {
    page: number;
    limit: number;
    total: number;
}

export class EntityPaginate<T = any> {
    data: T[];
    meta: PaginateMeta;
    constructor(data: T[], page, limit, total) {
        Object.assign(this, {
            data,
            meta: {
                page,
                limit,
                total,
            },
        });
    }
}

export class BaseQueryPaginate {
    @IsOptional()
    @Transform(({ value }) => +value)
    @IsInt()
    @Min(1)
    page: number;

    @IsOptional()
    @Transform(({ value }) => +value)
    @IsInt()
    @Min(1)
    limit: number;
}

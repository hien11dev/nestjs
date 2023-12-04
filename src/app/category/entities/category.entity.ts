import { EntityPaginate } from '@/utils/length-paginate';
import { Category } from '@prisma/client';

export class CategoryPaginate extends EntityPaginate<Category> {}

import { EntityPaginate } from '@/utils/length-paginate';
import { Post } from '@prisma/client';

export class PostPaginate extends EntityPaginate<Post> {}

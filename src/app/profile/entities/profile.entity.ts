import { User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class ProfileEntity {
    @Exclude()
    password: string;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
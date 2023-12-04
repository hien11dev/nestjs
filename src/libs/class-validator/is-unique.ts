import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { PrismaService } from '../prisma.service';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}
    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        const { model, column }: IsUniqueInterface = args.constraints[0];

        const dataCount = await this.prisma[model].count({
            where: {
                [column]: value,
            },
        });

        return dataCount === 0;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments.property;
        return `${field} is already exist`;
    }
}

export interface IsUniqueInterface {
    model: string;
    column: string;
}

export function IsUnique(options: IsUniqueInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        });
    };
}

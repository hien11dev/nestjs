import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { PrismaService } from '../prisma.service';

@ValidatorConstraint({ name: 'IsExistsConstraint', async: true })
@Injectable()
export class IsExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}
    validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
        const { model, column }: IsExistsInterface = args.constraints[0];

        const data = [value].flat();
        if (data.length === 0) {
            return true;
        }

        return this.prisma[model]
            .count({
                where: {
                    [column]: { in: data },
                },
            })
            .then((count: number) => count === data.length);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments.property;
        return `${field} is invalid`;
    }
}

export interface IsExistsInterface {
    model: string;
    column: string;
}

export function IsExists(options: IsExistsInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsExistsConstraint,
        });
    };
}

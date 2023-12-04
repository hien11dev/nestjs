import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator"
import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"

@ValidatorConstraint({ name: 'IsExistsConstraint', async: true })
@Injectable()
export class IsExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) { }
    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        const { model, column }: IsUniqeInterface = args.constraints[0];

        const dataCount = await this.prisma[model].count({
            where: {
                [column]: value
            }
        });

        return dataCount > 0;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments.property
        return `${field} is invalid`
    }
}

export interface IsUniqeInterface {
    model: string,
    column: string
}

export function IsExists(options: IsUniqeInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsExistsConstraint,
        })
    }
}
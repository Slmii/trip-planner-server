import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

const IsBefore = (property: string, validationOptions?: ValidationOptions) => {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'Matches',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return value < relatedValue;
				}
			}
		});
	};
};

const IsAfter = (property: string, validationOptions?: ValidationOptions) => {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'Matches',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return value > relatedValue;
				}
			}
		});
	};
};

export { IsBefore, IsAfter };

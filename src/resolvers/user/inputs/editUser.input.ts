import { IsAlpha, IsDate, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class EditUserInput {
	@Field()
	@IsEmail(undefined, {
		message: 'Provide a valid email address'
	})
	email!: string;

	@Field()
	@IsAlpha(undefined, {
		message: 'First name can only contain alpha characters'
	})
	firstName!: string;

	@Field()
	@IsAlpha(undefined, {
		message: 'Last name can only contain alpha characters'
	})
	lastName!: string;

	@Field()
	@IsDate({
		message: 'Provide a valid date of birth'
	})
	dateOfBirth!: Date;
}

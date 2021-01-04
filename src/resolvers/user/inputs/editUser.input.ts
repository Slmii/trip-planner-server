import { IsEmail, IsAlpha } from 'class-validator';
import { InputType, Field } from 'type-graphql';

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
}
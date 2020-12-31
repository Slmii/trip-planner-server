import { IsEmail, IsAlpha, MinLength, ValidateIf, IsBoolean, IsEnum } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { Match } from '../../../common/decorators';
import { Role } from '../user.enums';

@InputType()
export class AddUserInput {
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
	@MinLength(5, {
		message: 'Password must be atleast $constraint1 characters long'
	})
	password!: string;

	@Field()
	@ValidateIf(o => o.password)
	@Match('password', {
		message: 'Passwords do not match'
	})
	confirmPassword!: string;

	@Field({ nullable: true })
	@IsBoolean()
	status?: boolean;

	@Field({ nullable: true })
	@IsBoolean()
	locked?: boolean;

	@Field(type => Role, { nullable: true })
	@IsEnum(Role, {
		message: 'Provide a valid role'
	})
	role?: Role;
}

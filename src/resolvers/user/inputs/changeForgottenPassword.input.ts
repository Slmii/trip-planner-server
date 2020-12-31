import { MinLength, ValidateIf } from 'class-validator';
import { InputType, Field } from 'type-graphql';

import { Match } from '../../../common/decorators';

@InputType()
export class ChangeForgottenPasswordInput {
	@Field()
	token!: string;

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
}

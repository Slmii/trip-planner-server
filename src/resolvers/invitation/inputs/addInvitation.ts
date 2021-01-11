import { ArrayNotEmpty, IsArray, IsEmail, IsPositive } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AddInvitationInput {
	@Field(type => Int)
	@IsPositive()
	activityId!: number;

	@Field(type => [String])
	@IsArray()
	@IsEmail(undefined, {
		message: 'Provide a valid email address',
		each: true
	})
	@ArrayNotEmpty({
		message: 'Provide at least 1 email address'
	})
	emails!: string[];
}

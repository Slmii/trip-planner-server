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
		each: true
	})
	@ArrayNotEmpty({
		message: 'Provide atleast 1 email'
	})
	emails!: string[];
}

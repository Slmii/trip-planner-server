import { IsNotEmpty, IsBoolean } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AddPreparationInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide a preparation name'
	})
	name!: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	@IsBoolean()
	status?: boolean;
}

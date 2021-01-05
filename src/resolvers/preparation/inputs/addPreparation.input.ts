import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Field, InputType } from 'type-graphql';

import { AddSubPreparationInput } from '../../subPreparation/inputs';

@InputType()
export class AddPreparationInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide a preparation name'
	})
	name!: string;

	@Field({ nullable: true })
	description?: string;

	@Field(type => [AddSubPreparationInput])
	@ValidateNested()
	subPreparations?: AddSubPreparationInput[];
}

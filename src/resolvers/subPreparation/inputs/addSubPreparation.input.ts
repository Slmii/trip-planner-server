import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AddSubPreparationInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide a sub preparation name'
	})
	name!: string;

	@Field({ nullable: true })
	@IsBoolean()
	status?: boolean;
}

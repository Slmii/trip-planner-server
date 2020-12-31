import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AddLocationInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide a location name'
	})
	name!: string;
}

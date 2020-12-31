import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class AddActivityTypeInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide an activity name'
	})
	name!: string;

	@Field()
	@IsNotEmpty({
		message: 'Provide an activity type'
	})
	type!: string;
}

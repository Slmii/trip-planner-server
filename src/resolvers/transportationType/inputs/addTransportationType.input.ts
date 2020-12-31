import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class AddTransportationTypeInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide an transporation name'
	})
	name!: string;

	@Field()
	@IsNotEmpty({
		message: 'Provide an transporation type'
	})
	type!: string;
}

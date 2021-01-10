import {
    IsBoolean,
    IsDate,
    IsDefined,
    IsNotEmpty,
    IsPositive,
    Min,
    MinDate,
    MinLength,
    ValidateIf
} from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AddActivityInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide an activity name'
	})
	name!: string;

	@Field({ nullable: true })
	@ValidateIf(o => o.public)
	@MinLength(10, {
		message: 'Description must be atleast $constraint1 characters long'
	})
	@IsDefined({
		message: 'Provide a description'
	})
	description?: string;

	@Field()
	@IsNotEmpty({
		message: 'Provide a location for the activity'
	})
	location!: string;

	@Field()
	@MinDate(new Date(), {
		message: 'You can not select a date in the past'
	})
	@IsDate({
		message: 'Provide a valid date'
	})
	date!: Date;

	@Field()
	@IsNotEmpty({
		message: 'Provide a timezone'
	})
	timezone!: string;

	@Field()
	@IsBoolean()
	public!: boolean;

	@Field(type => Int, { nullable: true })
	@ValidateIf(o => o.public)
	@Min(1)
	@IsDefined({
		message: 'Provide a number of max people who can join'
	})
	maxPeople?: number;

	@Field(type => Int)
	@IsPositive()
	activityTypeId!: number;

	@Field(type => Int)
	@IsPositive()
	transportationTypeId!: number;
}

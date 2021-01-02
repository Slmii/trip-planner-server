import {
	IsBoolean,
	IsDate,
	IsNotEmpty,
	IsPositive,
	Min,
	MinDate,
	ValidateIf,
	MinLength,
	ArrayNotEmpty,
	ValidateNested,
	IsDefined
} from 'class-validator';
import { InputType, Field, Int } from 'type-graphql';

import { AddLocationInput } from '../../location/inputs';
import { AddActivityInput } from '../../activity/inputs';
import { AddPreparationInput } from '../../preparation/inputs';
import { IsAfter, IsBefore } from '../../../common/decorators';

@InputType()
export class AddTripInput {
	@Field()
	@IsNotEmpty({
		message: 'Provide a trip name'
	})
	name!: string;

	@Field({ nullable: true })
	@ValidateIf(o => o.public === true)
	@MinLength(50, {
		message: 'Description must be atleast $constraint1 characters long'
	})
	@IsDefined({
		message: 'Provide a description'
	})
	description?: string;

	@Field()
	@IsBoolean()
	public!: boolean;

	@Field()
	@MinDate(new Date(), {
		message: 'You can not select a date in the past'
	})
	@IsBefore('dateTo', {
		message: '"Date from" must be set before "date to"'
	})
	@IsDate({
		message: 'Provide a valid date'
	})
	dateFrom!: Date;

	@Field()
	@IsAfter('dateFrom', {
		message: '"Date to" must be set after "date from"'
	})
	@IsDate({
		message: 'Provide a valid date'
	})
	dateTo!: Date;

	@Field(type => Int)
	@Min(1, {
		message: 'Select atleast 1 adult'
	})
	adults!: number;

	@Field(type => Int, { nullable: true })
	@Min(0)
	children?: number;

	@Field(type => Int, { nullable: true })
	@Min(0)
	infants?: number;

	@Field({ nullable: true })
	backgroundUrl?: string;

	@Field(type => [AddLocationInput])
	@ValidateNested()
	@ArrayNotEmpty({
		message: 'Provide atleast 1 location'
	})
	locations!: AddLocationInput[];

	@Field(type => [AddActivityInput], { nullable: true })
	@ValidateNested()
	activities?: AddActivityInput[];

	@Field(type => [AddPreparationInput], { nullable: true })
	@ValidateNested()
	preparations?: AddPreparationInput[];
}

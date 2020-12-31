import { IsIn, Max, Min } from 'class-validator';
import { Field, Int, InputType } from 'type-graphql';

@InputType()
export class PaginationInput {
	@Min(0, {
		message: 'Min skip value is $constraint1, provided $value'
	})
	@Max(50, {
		message: 'Max skip value is $constraint1, provided $value'
	})
	@Field(type => Int)
	skip!: number;

	@Min(10, {
		message: 'Min take value is $constraint1, provided $value'
	})
	@Max(50, {
		message: 'Max take value is $constraint1, provided $value'
	})
	@IsIn([10, 25, 50], {
		message: 'Take value can only consist of $constraint1'
	})
	@Field(type => Int)
	take!: number;
}

@InputType()
export class StringFilter {
	@Field({ nullable: true })
	equals?: string;

	@Field(type => [String], { nullable: true })
	in?: string[];

	@Field(type => [String], { nullable: true })
	notIn?: string[];

	@Field({ nullable: true })
	lt?: string;

	@Field({ nullable: true })
	lte?: string;

	@Field({ nullable: true })
	gt?: string;

	@Field({ nullable: true })
	gte?: string;

	@Field({ nullable: true })
	contains?: string;

	@Field({ nullable: true })
	startsWith?: string;

	@Field({ nullable: true })
	endsWith?: string;

	@Field({ nullable: true })
	not?: string;
}

@InputType()
export class BoolFilter {
	@Field({ nullable: true })
	equals?: boolean;

	@Field({ nullable: true })
	not?: boolean;
}

@InputType()
export class DateFilter {
	@Field({ nullable: true })
	equals?: Date;

	@Field(type => [Date], { nullable: true })
	in?: Date[];

	@Field(type => [Date], { nullable: true })
	notIn?: Date[];

	@Field({ nullable: true })
	lt?: Date;

	@Field({ nullable: true })
	lte?: Date;

	@Field({ nullable: true })
	gt?: Date;

	@Field({ nullable: true })
	gte?: Date;

	@Field({ nullable: true })
	not?: Date;
}

@InputType()
export class IntFilter {
	@Field(type => Int, { nullable: true })
	equals?: number;

	@Field(type => [Int], { nullable: true })
	in?: number[];

	@Field(type => [Int], { nullable: true })
	notIn?: number[];

	@Field(type => Int, { nullable: true })
	lt?: number;

	@Field(type => Int, { nullable: true })
	lte?: number;

	@Field(type => Int, { nullable: true })
	gt?: number;

	@Field(type => Int, { nullable: true })
	gte?: number;

	@Field(type => Int, { nullable: true })
	not?: number;
}

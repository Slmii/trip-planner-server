import { registerEnumType } from 'type-graphql';

export enum Role {
	ADMIN = 'ADMIN',
	USER = 'USER'
}

registerEnumType(Role, {
	name: 'Role',
	description: 'Role of the User'
});

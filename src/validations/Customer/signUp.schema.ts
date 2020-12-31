import * as yup from 'yup';

import { SignUpUser } from '../../common/types';
import { Role } from '../../resolvers/user/user.enums';

// prettier-ignore
const signUp: yup.ObjectSchema<SignUpUser> = yup.object({
	firstName: yup
		.string()
		.trim()
		.matches(/^[a-zA-Z ]*$/, 'First name can only contain alpha characters')
		.required('Please provide your first name'),
	lastName: yup
		.string()
		.trim()
		.matches(/^[a-zA-Z ]*$/, 'Last name can only contain alpha characters')
		.required('Please provide your last name'),
	email: yup
		.string()
		.trim()
		.email('Please provide a valid email address')
		.required('Please provide your amail address'),
	password: yup
		.string()
		.trim()
		.min(5, 'Password must be between 5-20 characters long')
		.required('Please provide your password'),
	confirmPassword: yup
		.string()
		.trim()
		.oneOf([yup.ref('password'), undefined], 'Passwords do not match')
		.required('Please confirm your password'),
	status: yup
		.boolean(),
	locked: yup
		.boolean(),
	role: yup
		.mixed<Role>()
		.oneOf(Object.values(Role), 'Please select a valid role')
}).defined();

export default signUp;

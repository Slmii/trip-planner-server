import * as yup from 'yup';

import { EditUser } from '../../common/types';

// prettier-ignore
const editUser: yup.ObjectSchema<EditUser> = yup.object({
	firstName: yup
		.string()
		.trim()
		.matches(/^[a-zA-Z ]*$/, 'First name can only contain alpha characters'),
	lastName: yup
		.string()
		.trim()
		.matches(/^[a-zA-Z ]*$/, 'Last name can only contain alpha characters'),
	email: yup
		.string()
		.trim()
		.email('Please provide a valid email address')
}).defined();

export default editUser;

import * as yup from 'yup';

import { ChangeForgottenPassword } from '../../common/types';

// prettier-ignore
const changeForgottenPasswordSchema: yup.ObjectSchema<ChangeForgottenPassword> = yup.object({
    token: yup
        .string()
        .required('Please provide a token'),
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
}).defined();

export default changeForgottenPasswordSchema;

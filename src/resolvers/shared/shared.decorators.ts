import { createMethodDecorator } from 'type-graphql';
import { ObjectSchema } from 'yup';

import { errors, helpers } from '../../common/utils';

export const ValidateArgs = (schema: ObjectSchema) => {
	return createMethodDecorator(async ({ args }, next) => {
		try {
			await schema.validate(args.data, { abortEarly: false });
			return next();
		} catch (err) {
			return errors.invalidValues(helpers.serializeValidationError(err));
		}
	});
};

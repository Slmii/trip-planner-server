import * as yup from 'yup';

import { TripAddInput } from '../../resolvers/trip';

// prettier-ignore
const addTrip: yup.ObjectSchema<TripAddInput> = yup.object({
    name: yup
        .string()
        .trim()
        .required('Provide a trip name'),
    description: yup
        .string()
        .trim()
        .when('public', {
            is: true,
            then: yup
                .string()
                .min(50, 'Description must be atleast 50 characters long')
                .required('Provide a trip description')
        }),
    public: yup
        .boolean()
        .required(),
    dateFrom: yup
        .date()
        .required('Provide a date from')
        .when('dateTo', {
            is: value => (value instanceof Date),
            then: yup
                .date()
                .typeError('Provide a valid date from')
                .max(yup.ref('dateTo'), 'Date from cannot be set after date to'),
            otherwise: yup
                .date()
                .typeError('Provide a valid date from')
                .required('Provide a valid date from')
        }),
    dateTo: yup
        .date()
        .typeError('Provide a valid date to')
        .required('Provide a date to')
        .min(new Date(), 'You can not select a date in the past'),
    timezone: yup
        .string()
        .required('Provide a timezone'),
    adults: yup
        .number()
        .min(1, 'Include atleast 1 adult')
        .required(),
    children: yup
        .number()
        .positive(),
    infants: yup
        .number()
        .positive()
})
.defined();

export default addTrip;

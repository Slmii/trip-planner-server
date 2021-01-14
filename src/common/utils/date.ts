import dayjs from 'dayjs';

const isAfter = (isAfter: Date, customDate?: Date) => {
	if (customDate) {
		return dayjs(customDate).isAfter(isAfter);
	}

	return dayjs().isAfter(isAfter);
};

const isBefore = (isBefore: Date, customDate?: Date) => {
	if (customDate) {
		return dayjs(customDate).isBefore(isBefore);
	}

	return dayjs().isBefore(isBefore);
};

export default {
	isBefore,
	isAfter
};

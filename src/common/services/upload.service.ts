import { ReadStream, createWriteStream } from 'fs';
import shortid from 'shortid';

import { File } from '../types';

export default {
	upload: async (file: File) => {
		const { createReadStream, filename, mimetype, encoding } = await file;

		const extension = filename.split('.').pop() || 'png';
		const stream = createReadStream();

		const storeUpload = async (stream: ReadStream, extension: string): Promise<{ id: string; path: string }> => {
			const id = shortid.generate();
			const path = `./assets/images/${id}.${extension}`;

			return new Promise((resolve, reject) =>
				stream
					.pipe(createWriteStream(path))
					.on('finish', () => resolve({ id, path }))
					.on('error', reject)
			);
		};

		const { id, path } = await storeUpload(stream, extension);
		return { filename, mimetype, encoding, id, path };
	}
};

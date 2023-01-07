import {
	access,
	mkdir as fsMakeDir,
	readFile as fsReadFile,
	writeFile as fsWriteFile,
} from 'fs';

export async function isPathAccessible(path: string): Promise<boolean> {
	return new Promise((resolve) => access(path, (err) => resolve(!err)));
}

export async function readFile(path: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fsReadFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
			if (err) return reject(err);
			return resolve(data.toString());
		});
	});
}

export async function writeFile(
	path: string,
	data: string | NodeJS.ArrayBufferView,
): Promise<void> {
	return new Promise((resolve, reject) => {
		fsWriteFile(path, data, (err: NodeJS.ErrnoException | null) => {
			if (err) return reject(err);
			return resolve();
		});
	});
}

export async function createDirectory(path: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fsMakeDir(path, (err: NodeJS.ErrnoException | null) => {
			if (err) return reject(err);
			return resolve();
		});
	});
}

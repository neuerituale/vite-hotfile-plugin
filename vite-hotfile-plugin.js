import fs from 'fs';
import path from 'path';

export default function viteHotfilePlugin(options = {}) {
	const resolvedOptions = {
		publicDirectory: 'public', // Default directory
		hotFileName: 'vite.hot', // Default file name
		logging: false, // Optional logging
		...options,
	};

	// Create the absolute path to the hotfile
	const hotFilePath = path.resolve(
		process.cwd(),
		resolvedOptions.publicDirectory,
		resolvedOptions.hotFileName
	);

	// Function to create the hotfile
	const createHotFile = (url) => {
		try {
			fs.mkdirSync(path.dirname(hotFilePath), { recursive: true });
			fs.writeFileSync(hotFilePath, url);

			if (resolvedOptions.logging) {
				console.log(`[vite-hotfile-plugin] Hotfile created: ${hotFilePath}`);
			}
		} catch (e) {
			console.error(`[vite-hotfile-plugin] Error creating hotfile:`, e);
		}
	};

	// Function to delete the hot file
	const cleanupHotFile = () => {
		if (fs.existsSync(hotFilePath)) {
			fs.rmSync(hotFilePath);
		}
	};

	// build url from server config
	const buildUrl = () => {
		const address = server.httpServer.address();
		const protocol = server.config.server.https ? 'https' : 'http';

		let host =
			typeof server.config.server.host === 'string' && server.config.server.host !== '0.0.0.0'
				? server.config.server.host
				: 'localhost';

		const port = typeof address === 'object' ? address.port : server.config.server.port;
		return `${protocol}://${host}:${port}`;
	};

	return {
		name: 'vite-hotfile-plugin',

		configureServer(server) {
			server.httpServer?.once('listening', () => {
				createHotFile(resolvedOptions?.url ?? buildUrl());
			});

			// Cleanup when the server shuts down
			process.on('exit', cleanupHotFile);
			['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
				process.on(signal, () => {
					cleanupHotFile();
					process.exit();
				});
			});
		},
	};
}
